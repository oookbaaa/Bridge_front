'use client';

import type React from 'react';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    alert(
      'Merci pour votre message! Nous vous répondrons dans les plus brefs délais.'
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['123 Rue de la Bridge', 'Tunis 1001, Tunisie'],
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+216 71 123 456', '+216 98 765 432'],
    },
    {
      icon: Mail,
      title: 'Courriel',
      details: ['info@FTB.tn', 'tournaments@FTB.tn'],
    },
    {
      icon: Clock,
      title: "Heures d'ouverture",
      details: ['Mon-Fri: 9:00 AM - 5:00 PM', 'Sat: 9:00 AM - 1:00 PM'],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">
            Contactez-nous
          </h1>
          <p className="font-body text-xl text-slate-600 max-w-2xl mx-auto">
            Nous aimerions vous entendre - Pour toute question ou pour en savoir
            plus sur notre fédération, contactez-nous!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">
              Informations de contact
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-primary mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p
                            key={idx}
                            className="font-body text-slate-600 text-sm"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">
                  Envoyez-nous un message
                </CardTitle>
                <p className="font-body text-slate-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons
                  dans les plus brefs délais.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="font-body">
                        Nom complet *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Entrez votre nom complet"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-body">
                        Adresse email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Entrez votre adresse email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="font-body">
                        Numéro de téléphone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Entrez votre numéro de téléphone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="font-body">
                        Sujet *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Qu'est-ce que c'est?"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="font-body">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 min-h-[120px]"
                      placeholder="Dites-nous plus sur votre demande..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    Envoyer un message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="font-heading">
                  Questions fréquemment posées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-body font-semibold text-primary mb-2">
                    Comment devenir membre?
                  </h4>
                  <p className="font-body text-slate-600 text-sm">
                    Vous pouvez devenir membre en participant à l'un de nos
                    événements ou en nous contactant directement. La membership
                    inclut la participation aux tournois et l'accès à nos
                    programmes de formation.
                  </p>
                </div>
                <div>
                  <h4 className="font-body font-semibold text-primary mb-2">
                    Faites-vous des cours pour débutants?
                  </h4>
                  <p className="font-body text-slate-600 text-sm">
                    Oui! Nous organisons régulièrement des ateliers pour
                    débutants et avons des cours en continu pour de nouveaux
                    joueurs. Vérifiez notre page événements pour les prochaines
                    sessions.
                  </p>
                </div>
                <div>
                  <h4 className="font-body font-semibold text-primary mb-2">
                    Comment sont organisés les tournois?
                  </h4>
                  <p className="font-body text-slate-600 text-sm">
                    Nos tournois sont organisés par niveau de compétence et
                    suivent les règles internationales du bridge. Nous
                    organisons à la fois des compétitions individuelles et des
                    équipes tout au long de l'année.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                Nous trouver
              </CardTitle>
              <p className="font-body text-slate-600">
                Visitez notre siège social au cœur de Tunis
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
                  <p className="font-body text-slate-600">
                    Une carte interactive serait affichée ici
                  </p>
                  <p className="font-body text-sm text-slate-500 mt-2">
                    123 Rue de la Bridge, Tunis 1001, Tunisie
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
