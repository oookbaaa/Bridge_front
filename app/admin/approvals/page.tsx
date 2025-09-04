'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { adminService } from '@/lib/admin';
import type { User } from '@/lib/auth';
import {
  Search,
  Check,
  X,
  Eye,
  Filter,
  Clock,
  Download,
  FileText,
  Image,
  File,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function AdminApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);

  useEffect(() => {
    const loadPendingUsers = async () => {
      try {
        const data = await adminService.getPendingUsers();
        setPendingUsers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des approbations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPendingUsers();
  }, []);

  const handleApproveUser = async (user: User) => {
    try {
      const success = await adminService.approveUser(user.id, approvalNotes);
      if (success) {
        setPendingUsers(pendingUsers.filter((u) => u.id !== user.id));
        setIsApprovalDialogOpen(false);
        setApprovalNotes('');
        setSelectedUser(null);
        // Show success message
        alert('Utilisateur approuvé avec succès!');
      } else {
        alert("Erreur lors de l'approbation de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      alert("Erreur lors de l'approbation de l'utilisateur");
    }
  };

  const handleRejectUser = async (user: User) => {
    if (!rejectionReason.trim()) {
      alert('Veuillez fournir une raison de rejet');
      return;
    }

    try {
      const success = await adminService.rejectUser(
        user.id,
        rejectionReason,
        rejectionNotes
      );
      if (success) {
        setPendingUsers(pendingUsers.filter((u) => u.id !== user.id));
        setIsRejectionDialogOpen(false);
        setRejectionReason('');
        setRejectionNotes('');
        setSelectedUser(null);
        // Show success message
        alert('Utilisateur rejeté avec succès!');
      } else {
        alert("Erreur lors du rejet de l'utilisateur");
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert("Erreur lors du rejet de l'utilisateur");
    }
  };

  const filteredUsers = pendingUsers.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cin?.toString().includes(searchTerm);
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">
            Approbations en attente
          </h1>
          <p className="font-body text-slate-600">
            Vérifiez et approuvez les inscriptions des nouveaux joueurs.
          </p>
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          {filteredUsers.length} en attente
        </Badge>
      </div>

      {/* Search Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher par nom, email ou CIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pending Users List */}
      <div className="grid gap-6">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-slate-600 mb-2">
                Aucune approbation en attente
              </h3>
              <p className="font-body text-slate-500">
                Tous les utilisateurs ont été traités.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div>
                        <h3 className="font-heading text-lg font-semibold">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="font-body text-slate-600">{user.email}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200"
                      >
                        En attente
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-500">
                          CIN
                        </Label>
                        <p className="font-body">{user.cin || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-500">
                          Ville
                        </Label>
                        <p className="font-body">{user.city}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-500">
                          Téléphone
                        </Label>
                        <p className="font-body">{user.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-500">
                          Date d'inscription
                        </Label>
                        <p className="font-body">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Additional User Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-500">
                          Genre
                        </Label>
                        <p className="font-body">{user.genre}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-500">
                          Date de naissance
                        </Label>
                        <p className="font-body">
                          {new Date(user.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-500">
                          Adresse
                        </Label>
                        <p className="font-body">{user.adresse}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-500">
                          Équipe nationale
                        </Label>
                        <p className="font-body">
                          {user.equipeNationale ? 'Oui' : 'Non'}
                        </p>
                      </div>
                    </div>

                    {/* Optional Information */}
                    {(user.disipline ||
                      user.passportNumber ||
                      user.birthPlace ||
                      user.studyLevel ||
                      user.club) && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-700 mb-2">
                          Informations supplémentaires
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {user.disipline && (
                            <div>
                              <Label className="text-sm font-medium text-slate-500">
                                Discipline
                              </Label>
                              <p className="font-body">{user.disipline}</p>
                            </div>
                          )}
                          {user.passportNumber && (
                            <div>
                              <Label className="text-sm font-medium text-slate-500">
                                Numéro de passeport
                              </Label>
                              <p className="font-body">{user.passportNumber}</p>
                            </div>
                          )}
                          {user.birthPlace && (
                            <div>
                              <Label className="text-sm font-medium text-slate-500">
                                Lieu de naissance
                              </Label>
                              <p className="font-body">{user.birthPlace}</p>
                            </div>
                          )}
                          {user.studyLevel && (
                            <div>
                              <Label className="text-sm font-medium text-slate-500">
                                Niveau d'études
                              </Label>
                              <p className="font-body">{user.studyLevel}</p>
                            </div>
                          )}
                          {user.club && (
                            <div>
                              <Label className="text-sm font-medium text-slate-500">
                                Club
                              </Label>
                              <p className="font-body">{user.club}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* User Files */}
                    {user.files && user.files.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Documents fournis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {user.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <div className="flex items-center space-x-2">
                                {file.mimeType.startsWith('image/') ? (
                                  <Image className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <File className="h-4 w-4 text-gray-600" />
                                )}
                                <div>
                                  <p className="text-sm font-medium">
                                    {file.fileName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {file.documentType} •{' '}
                                    {(file.fileSize / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  window.open(file.fileUrl, '_blank')
                                }
                                className="ml-2"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.license && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <Label className="text-sm font-medium text-slate-500">
                          Licence
                        </Label>
                        <p className="font-body">
                          {user.license.licenseNumber} - {user.license.status}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Dialog
                      open={
                        isApprovalDialogOpen && selectedUser?.id === user.id
                      }
                      onOpenChange={(open) => {
                        setIsApprovalDialogOpen(open);
                        if (open) setSelectedUser(user);
                        if (!open) {
                          setSelectedUser(null);
                          setApprovalNotes('');
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approuver
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approuver l'utilisateur</DialogTitle>
                          <DialogDescription>
                            Êtes-vous sûr de vouloir approuver {user.firstName}{' '}
                            {user.lastName} ?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="approval-notes">
                              Notes d'approbation (optionnel)
                            </Label>
                            <Textarea
                              id="approval-notes"
                              placeholder="Ajoutez des notes pour cette approbation..."
                              value={approvalNotes}
                              onChange={(e) => setApprovalNotes(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsApprovalDialogOpen(false);
                              setSelectedUser(null);
                              setApprovalNotes('');
                            }}
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={() => handleApproveUser(user)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirmer l'approbation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={
                        isRejectionDialogOpen && selectedUser?.id === user.id
                      }
                      onOpenChange={(open) => {
                        setIsRejectionDialogOpen(open);
                        if (open) setSelectedUser(user);
                        if (!open) {
                          setSelectedUser(null);
                          setRejectionReason('');
                          setRejectionNotes('');
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 border-red-200"
                          onClick={() => setSelectedUser(user)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Rejeter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rejeter l'utilisateur</DialogTitle>
                          <DialogDescription>
                            Veuillez fournir une raison pour le rejet de{' '}
                            {user.firstName} {user.lastName}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="rejection-reason">
                              Raison du rejet *
                            </Label>
                            <Textarea
                              id="rejection-reason"
                              placeholder="Ex: CIN ne correspond pas aux documents fournis..."
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="rejection-notes">
                              Notes supplémentaires (optionnel)
                            </Label>
                            <Textarea
                              id="rejection-notes"
                              placeholder="Ajoutez des notes supplémentaires..."
                              value={rejectionNotes}
                              onChange={(e) =>
                                setRejectionNotes(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsRejectionDialogOpen(false);
                              setSelectedUser(null);
                              setRejectionReason('');
                              setRejectionNotes('');
                            }}
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={() => handleRejectUser(user)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={!rejectionReason.trim()}
                          >
                            Confirmer le rejet
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
