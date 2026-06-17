
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, Upload, ArrowLeft } from 'lucide-react';
import { useCards, useAddCard, useUpdateCard, useDeleteCard } from '@/hooks/useSupabaseCards';
import { seedAllCards } from '@/utils/migrateData';
import { Card as GameCard } from '@/types/game';

interface AdminCardsScreenProps {
  onBack: () => void;
}

const AdminCardsScreen: React.FC<AdminCardsScreenProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [editingCard, setEditingCard] = useState<GameCard | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    alcoholLevel: '',
    sexualLevel: '',
    isDeep: false,
    isVote: false
  });
  
  const { data: cards = [], isLoading: cardsLoading, refetch } = useCards();
  const addCardMutation = useAddCard();
  const updateCardMutation = useUpdateCard();
  const deleteCardMutation = useDeleteCard();

  // Seed automatique des nouvelles cartes au chargement de l'admin
  useEffect(() => {
    const runSync = async () => {
      try {
        await seedAllCards();
        refetch();
      } catch (error) {
        console.error('Erreur de sync:', error);
      }
    };
    runSync();
  }, [refetch]);

  const handleSyncCards = async () => {
    try {
      toast({ title: '⏳ Synchronisation...', description: 'Injection des nouvelles cartes depuis gameData' });
      await seedAllCards();
      await refetch();
      toast({ title: '✅ Sync terminée', description: 'Nouvelles cartes injectées en base' });
    } catch (error) {
      toast({ title: '❌ Erreur sync', description: String(error), variant: 'destructive' });
    }
  };

  const filteredCards = cards.filter(card => {
    if (filters.alcoholLevel && card.alcoholLevel?.toString() !== filters.alcoholLevel) return false;
    if (filters.sexualLevel && card.sexualLevel?.toString() !== filters.sexualLevel) return false;
    if (filters.isDeep && !card.isDeep) return false;
    if (filters.isVote && !card.isVote) return false;
    return true;
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const proximityValue = formData.get('proximityLevel') as string;
    const dateModeValue = formData.get('dateMode') as string;
    
    const cardData = {
      content: formData.get('content') as string,
      alcoholLevel: parseInt(formData.get('alcoholLevel') as string) || 0,
      sexualLevel: parseInt(formData.get('sexualLevel') as string) || 0,
      isDeep: formData.get('isDeep') === 'on',
      isVote: formData.get('isVote') === 'on',
      proximityLevel: (proximityValue && ['stranger', 'friend', 'close'].includes(proximityValue)) 
        ? proximityValue as 'stranger' | 'friend' | 'close' 
        : undefined,
      dateMode: (dateModeValue && ['no', 'compatible', 'exclusive'].includes(dateModeValue)) 
        ? dateModeValue as 'no' | 'compatible' | 'exclusive' 
        : undefined,
      explicitlySexual: formData.get('explicitlySexual') === 'on'
    };

    try {
      if (editingCard) {
        await updateCardMutation.mutateAsync({ ...cardData, id: editingCard.id });
        toast({ title: "Carte modifiée avec succès !" });
        setEditingCard(null);
      } else {
        await addCardMutation.mutateAsync(cardData);
        toast({ title: "Nouvelle carte ajoutée !" });
        setShowAddForm(false);
      }
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: "Impossible de sauvegarder la carte",
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async (cardId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      try {
        await deleteCardMutation.mutateAsync(cardId);
        toast({ title: "Carte supprimée" });
      } catch (error) {
        toast({ 
          title: "Erreur", 
          description: "Impossible de supprimer la carte",
          variant: "destructive" 
        });
      }
    }
  };

  if (cardsLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} className="text-white border-white hover:bg-white hover:text-purple-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-white">🎮 Gestion des cartes Partiz</h1>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une carte
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-purple-900">
            <Upload className="h-4 w-4 mr-2" />
            Import Excel (bientôt)
          </Button>
          <Button
            onClick={handleSyncCards}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            🔄 Sync nouvelles cartes
          </Button>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Niveau alcool</Label>
                <Select value={filters.alcoholLevel} onValueChange={(value) => setFilters({...filters, alcoholLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    {[0,1,2,3,4,5].map(level => (
                      <SelectItem key={level} value={level.toString()}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Niveau sexualité</Label>
                <Select value={filters.sexualLevel} onValueChange={(value) => setFilters({...filters, sexualLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    {[0,1,2,3,4,5].map(level => (
                      <SelectItem key={level} value={level.toString()}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input 
                  type="checkbox" 
                  id="deep" 
                  checked={filters.isDeep}
                  onChange={(e) => setFilters({...filters, isDeep: e.target.checked})}
                />
                <Label htmlFor="deep">Deep seulement</Label>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input 
                  type="checkbox" 
                  id="vote" 
                  checked={filters.isVote}
                  onChange={(e) => setFilters({...filters, isVote: e.target.checked})}
                />
                <Label htmlFor="vote">Votes seulement</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{cards.length}</div>
              <div className="text-sm text-gray-600">Cartes totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{filteredCards.length}</div>
              <div className="text-sm text-gray-600">Cartes filtrées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{cards.filter(c => c.isDeep).length}</div>
              <div className="text-sm text-gray-600">Cartes Deep</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{cards.filter(c => c.isVote).length}</div>
              <div className="text-sm text-gray-600">Cartes Vote</div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire d'ajout/modification */}
        {(showAddForm || editingCard) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingCard ? 'Modifier la carte' : 'Ajouter une nouvelle carte'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="content">Contenu de la carte *</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    required
                    defaultValue={editingCard?.content || ''}
                    placeholder="Écrivez le contenu de votre carte..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alcoholLevel">Niveau alcool (0-5)</Label>
                    <Input 
                      type="number" 
                      id="alcoholLevel" 
                      name="alcoholLevel" 
                      min="0" 
                      max="5" 
                      defaultValue={editingCard?.alcoholLevel || 0}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sexualLevel">Niveau sexualité (0-5)</Label>
                    <Input 
                      type="number" 
                      id="sexualLevel" 
                      name="sexualLevel" 
                      min="0" 
                      max="5" 
                      defaultValue={editingCard?.sexualLevel || 0}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="isDeep" 
                      defaultChecked={editingCard?.isDeep || false}
                    />
                    <span>Question profonde</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="isVote" 
                      defaultChecked={editingCard?.isVote || false}
                    />
                    <span>Question vote</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="explicitlySexual" 
                      defaultChecked={editingCard?.explicitlySexual || false}
                    />
                    <span>Explicitement sexuel</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={addCardMutation.isPending || updateCardMutation.isPending}>
                    {editingCard ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCard(null);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Liste des cartes */}
        <div className="space-y-4">
          {filteredCards.map(card => (
            <Card key={card.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {card.alcoholLevel! > 0 && <Badge variant="secondary">🍺 {card.alcoholLevel}</Badge>}
                      {card.sexualLevel! > 0 && <Badge variant="secondary">🔥 {card.sexualLevel}</Badge>}
                      {card.isDeep && <Badge variant="secondary">🧠 Deep</Badge>}
                      {card.isVote && <Badge variant="secondary">🗳️ Vote</Badge>}
                    </div>
                    <p className="text-sm">{card.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCard(card)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(card.id)}
                      disabled={deleteCardMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCardsScreen;
