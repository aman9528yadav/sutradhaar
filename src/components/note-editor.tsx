
"use client";

import { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, Trash2, Paperclip, Smile, X, Lock, Unlock, Share2, ImageIcon, FileText, Download, Notebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Note } from './notepad';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useLanguage } from '@/context/language-context';
import { listenToUserNotes, updateUserNotes, listenToUserData, UserData, getGuestKey, updateUserData } from '@/services/firestore';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import RichTextEditor from './ui/rich-text-editor';

// --- State Management ---

type NoteState = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type NoteAction =
  | { type: 'SET_NOTE'; payload: Note }
  | { type: 'UPDATE_FIELD'; payload: { field: keyof NoteState; value: any } }
  | { type: 'SET_CONTENT'; payload: string };

function noteReducer(state: NoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case 'SET_NOTE':
      return { ...action.payload };
    case 'UPDATE_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_CONTENT':
        return { ...state, content: action.payload };
    default:
      return state;
  }
}

const initialState: NoteState = {
  title: '',
  content: '',
  category: '',
  isFavorite: false,
  attachment: null,
  isLocked: false,
  backgroundStyle: 'none',
};

// --- Component ---

export function NoteEditor({ noteId }: { noteId: string }) {
    const [noteState, dispatch] = useReducer(noteReducer, initialState);
    const { title, content, category, isFavorite, attachment, isLocked, backgroundStyle } = noteState;

    const [isClient, setIsClient] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    
    // Dialog states
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [showSetPasswordDialog, setShowSetPasswordDialog] = useState(false);
    const [showPremiumLockDialog, setShowPremiumLockDialog] = useState(false);

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const router = useRouter();
    const { toast } = useToast();
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isNewNote = noteId === 'new';
    const userEmail = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userProfile') || '{}')?.email : null;


    // --- Data Fetching and Initialization ---
    useEffect(() => {
        setIsClient(true);

        const handleNotes = (notes: Note[]) => {
            setAllNotes(notes);
            if (!isNewNote) {
                const noteToEdit = notes.find(note => note.id === noteId);
                if (noteToEdit) {
                    dispatch({ type: 'SET_NOTE', payload: noteToEdit });
                } else if (userEmail) { // Only show not found if it's not a guest loading local notes
                    toast({ title: t('noteEditor.toast.notFound'), variant: "destructive" });
                    router.push('/notes');
                }
            }
        };

        if (userEmail) {
            const unsubNotes = listenToUserNotes(userEmail, handleNotes);
            const unsubUserData = listenToUserData(userEmail, setUserData);
            return () => {
                unsubNotes();
                unsubUserData();
            };
        } else { // Guest user
            const localNotes = localStorage.getItem(getGuestKey('notes'));
            handleNotes(localNotes ? JSON.parse(localNotes) : []);
        }

    }, [isNewNote, noteId, router, t, userEmail]);

    // --- Unsaved Changes Warning ---
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // Required for legacy browsers
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // --- Handlers ---
    
    const handleFieldChange = (field: keyof NoteState, value: any) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
        setIsDirty(true);
    };

    const handleContentChange = useCallback((newContent: string) => {
        dispatch({ type: 'SET_CONTENT', payload: newContent });
        setIsDirty(true);
    }, []);

    const handleBack = () => {
        if (isDirty) {
            setShowUnsavedDialog(true);
        } else {
            router.back();
        }
    };
    
    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            toast({
                title: t('noteEditor.toast.emptyNote.title'),
                description: t('noteEditor.toast.emptyNote.description'),
                variant: "destructive"
            });
            return;
        }

        const now = new Date().toISOString();
        let updatedNotes: Note[];

        if (isNewNote) {
            const newNote: Note = {
                ...noteState,
                id: uuidv4(),
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            };
            updatedNotes = [...allNotes, newNote];
        } else {
            updatedNotes = allNotes.map(note =>
                note.id === noteId ? { ...note, ...noteState, updatedAt: now } : note
            );
        }
        
        updateUserNotes(userEmail, updatedNotes);
        setIsDirty(false);
        toast({
            title: t('noteEditor.toast.saved.title'),
            description: t('noteEditor.toast.saved.description'),
        });
        router.push('/notes');
    };

    const handleSoftDelete = () => {
        if (isNewNote) {
            router.push('/notes');
            return;
        }
        const updatedNotes = allNotes.map(note =>
            note.id === noteId ? { ...note, deletedAt: new Date().toISOString() } : note
        );
        updateUserNotes(userEmail, updatedNotes);
        setIsDirty(false);
        toast({ title: t('notepad.toast.movedToTrash') });
        router.push('/notes');
    };

    const handleLockToggle = () => {
        if (!isLocked && !userData?.notePassword) {
            setShowSetPasswordDialog(true);
        } else {
            handleFieldChange('isLocked', !isLocked);
        }
    };

    const handleSetInitialPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            return toast({ title: "Passwords do not match", variant: "destructive" });
        }
        if (newPassword.length < 4) {
            return toast({ title: "Password must be at least 4 characters", variant: "destructive" });
        }
        if (userEmail) {
            await updateUserData(userEmail, { notePassword: newPassword });
            handleFieldChange('isLocked', true);
            setShowSetPasswordDialog(false);
            setNewPassword('');
            setConfirmNewPassword('');
            toast({ title: "Password Set & Note Locked", description: "You can change this password in settings." });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                handleFieldChange('attachment', `${file.name}|${result}`);
                toast({ title: "File attached successfully!" });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAttachment = () => {
        handleFieldChange('attachment', null);
        toast({ title: t('noteEditor.toast.imageRemoved') });
    };

    const handleExport = async (type: 'png' | 'pdf' | 'txt') => {
        const isPremium = userData?.settings?.isPremium || userEmail === "amanyadavyadav9458@gmail.com";
        if (!isPremium) {
            setShowPremiumLockDialog(true);
            return;
        }

        const contentEl = document.querySelector('.ProseMirror') as HTMLElement;
        if (!contentEl) return;

        const fileName = title.trim() || 'note';

        if (type === 'txt') {
            const textContent = `Title: ${title}\nCategory: ${category}\n\n${contentEl.innerText}`;
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: "Exported as TXT!" });
            return;
        }
        
        try {
            const canvas = await html2canvas(contentEl, { scale: 2, useCORS: true, backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');

            if (type === 'png') {
                const a = document.createElement('a');
                a.href = imgData;
                a.download = `${fileName}.png`;
                a.click();
                toast({ title: "Exported as Image!" });
            } else if (type === 'pdf') {
                const pdf = new jsPDF({
                    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`${fileName}.pdf`);
                toast({ title: "Exported as PDF!" });
            }
        } catch (error) {
            console.error("Export error:", error);
            toast({ title: "Could not export note", variant: "destructive" });
        }
    };
    
    // --- Render Methods ---
    
    const renderAttachment = () => {
        if (!attachment) return null;
        const [fileName, dataUri] = attachment.split('|');
        const isImage = dataUri.startsWith('data:image/');

        return isImage ? (
            <div className="relative w-full h-64 my-4 group">
                <Image src={dataUri} alt="Attachment" layout="fill" objectFit="contain" className="rounded-md" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100" onClick={handleRemoveAttachment}>
                    <X size={16} />
                </Button>
            </div>
        ) : (
            <div className="relative group p-2 border rounded-lg my-4 flex items-center justify-between">
                <a href={dataUri} download={fileName} className="flex items-center gap-2 hover:underline">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm truncate font-medium">{fileName}</span>
                </a>
                <Button variant="destructive" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100" onClick={handleRemoveAttachment}>
                    <X size={14} />
                </Button>
            </div>
        );
    };

    if (!isClient && !isNewNote) return null; // Prevents hydration mismatch

    return (
        <div className="w-full max-w-md mx-auto flex flex-col h-screen">
            {/* Header */}
            <header className="flex items-center justify-between p-4 flex-shrink-0 sticky top-0 z-50 bg-background">
                <Button variant="secondary" className="rounded-xl shadow-md" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><Notebook /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => handleFieldChange('backgroundStyle', 'none')}>None</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleFieldChange('backgroundStyle', 'lines')}>Lines</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleFieldChange('backgroundStyle', 'dots')}>Dots</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleFieldChange('backgroundStyle', 'grid')}>Grid</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><Share2 /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => handleExport('png')}><ImageIcon className="mr-2 h-4 w-4" /> Export as Image</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleExport('txt')}><FileText className="mr-2 h-4 w-4" /> Export as TXT</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleExport('pdf')}><Download className="mr-2 h-4 w-4" /> Export as PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" onClick={handleLockToggle} className={cn(isLocked && "bg-primary/10 text-primary")}>
                        {isLocked ? <Lock /> : <Unlock />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleSave}><Save /></Button>
                </div>
            </header>

            {/* Editor Fields */}
            <div className="px-4 flex-shrink-0">
                <Input
                    value={title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder={t('noteEditor.placeholders.title')}
                    className="w-full bg-card border-border h-12 text-lg font-bold focus-visible:ring-1 focus-visible:ring-ring mb-2"
                />
                <Input
                    value={category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    placeholder={t('noteEditor.placeholders.category')}
                    className="w-full bg-card border-border h-12 text-base focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>

            {/* Content Area */}
            <div className={cn("p-4 rounded-t-xl flex-grow flex flex-col gap-4 mt-4", `note-bg-${backgroundStyle}`)}>
                {renderAttachment()}
                <RichTextEditor
                    value={content}
                    onChange={handleContentChange}
                    className={cn(`note-bg-${backgroundStyle}`)}
                />
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip /></Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleSoftDelete}><Trash2 /></Button>
                </div>
            </div>

            {/* Dialogs */}
            <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('noteEditor.unsavedDialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('noteEditor.unsavedDialog.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('noteEditor.unsavedDialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => { setIsDirty(false); router.back(); }}>
                            {t('noteEditor.unsavedDialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={showSetPasswordDialog} onOpenChange={setShowSetPasswordDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Set Your Note Password</AlertDialogTitle>
                        <AlertDialogDescription>This password will be used to lock and unlock your notes. You can change it later in settings.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                           <Label htmlFor="new-password">New Password</Label>
                           <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="confirm-password">Confirm Password</Label>
                           <Input id="confirm-password" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                        </div>
                         <Button variant="link" size="sm" className="h-auto p-0 justify-start" onClick={() => router.push('/forgot-password')}>Forgot password?</Button>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSetInitialPassword}>Set Password & Lock</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
             <AlertDialog open={showPremiumLockDialog} onOpenChange={setShowPremiumLockDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Premium Feature Locked</AlertDialogTitle>
                        <AlertDialogDescription>This is a premium feature. Please upgrade to use it.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push('/premium')}>Go Premium</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
