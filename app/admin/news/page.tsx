'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { adminService, type NewsArticle } from '@/lib/admin';
import { Search, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await adminService.getNews();
        setNews(data);
      } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const handleDeleteNews = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité?')) {
      try {
        await adminService.deleteNews(id);
        setNews(news.filter((article) => article.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression de l'actualité:", error);
      }
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      await adminService.updateNews(id, { published: !published });
      setNews(
        news.map((article) =>
          article.id === id ? { ...article, published: !published } : article
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'actualité:", error);
    }
  };

  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: NewsArticle['category']) => {
    switch (category) {
      case 'Tournament':
        return 'bg-blue-100 text-blue-800';
      case 'Education':
        return 'bg-green-100 text-green-800';
      case 'Event':
        return 'bg-purple-100 text-purple-800';
      case 'Announcement':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            Gestion des actualités
          </h1>
          <p className="font-body text-slate-600">
            Créer et gérer les actualités et les annonces.
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Créer une actualité
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher des actualités par titre ou contenu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* News Articles */}
      <div className="space-y-4">
        {filteredNews.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                    <Badge
                      variant={article.published ? 'default' : 'secondary'}
                    >
                      {article.published ? 'Publié' : 'Brouillon'}
                    </Badge>
                    <span className="font-body text-sm text-slate-500">
                      by {article.author} •{' '}
                      {new Date(article.publishDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                    {article.title}
                  </h3>
                  <p className="font-body text-slate-600 mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTogglePublish(article.id, article.published)
                      }
                    >
                      {article.published ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Dépublier
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Publier
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNews(article.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Plus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold text-slate-600 mb-2">
              Aucune actualité trouvée
            </h3>
            <p className="font-body text-slate-500">
              {searchTerm
                ? 'Essayez de modifier vos termes de recherche.'
                : 'Créez votre première actualité pour commencer.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
