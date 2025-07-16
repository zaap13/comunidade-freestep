// Arquivo: src/components/OnboardingForm.tsx
'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OnboardingForm() {
  const { update } = useSession();
  const [nick, setNick] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!nick) {
      setError('O nick não pode estar vazio.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Algo deu errado.');
      }
      await update({ nick });
      window.location.href = '/';
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Complete seu Perfil</CardTitle>
        <CardDescription>Escolha um nick único para a comunidade. Esta será sua identidade principal.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="onboarding-form">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nick">Nick</Label>
              <Input 
                id="nick" 
                placeholder="Seu nick de dançarino"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" form="onboarding-form" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar e Entrar'}
        </Button>
      </CardFooter>
    </Card>
  );
}