// app/app/admin/dossiers/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabaseServer } from "@/lib/supabase-server";
import { Search, Filter, CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import Link from "next/link";

async function getDossiers() {
  const sb = await supabaseServer();

  const { data: apps, error } = await sb
    .from("applications")
    .select("id, statut, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getDossiers error:", error.message);
    return [];
  }

  if (!apps || apps.length === 0) return [];

  const userIds = apps.map(a => a.user_id);

  const { data: profiles } = await sb
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  const dossiersWithProfiles = apps.map(app => {
    const profile = profiles?.find(p => p.id === app.user_id);
    
    if (!profile) {
      return {
        ...app,
        profiles: {
          full_name: "Utilisateur",
          email: "Email inconnu",
          initial: "?"
        }
      };
    }

    const displayName = profile.full_name || profile.email;

    return {
      ...app,
      profiles: {
        full_name: displayName,
        email: profile.email,
        initial: displayName[0].toUpperCase()
      }
    };
  });

  return dossiersWithProfiles;
}

export default async function DossiersAdminPage() {
  const dossiers = await getDossiers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des dossiers</h1>
          <p className="text-gray-600 mt-1">{dossiers.length} dossier(s) au total</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Rechercher..." className="pl-10 rounded-xl" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filtrer
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{dossiers.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-amber-600">
                  {dossiers.filter((d: any) => d.statut === "en attente").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Validés</p>
                <p className="text-2xl font-bold text-green-600">
                  {dossiers.filter((d: any) => d.statut === "validé").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Refusés</p>
                <p className="text-2xl font-bold text-red-600">
                  {dossiers.filter((d: any) => d.statut === "refusé").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les dossiers</CardTitle>
        </CardHeader>
        <CardContent>
          {dossiers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun dossier pour le moment</p>
          ) : (
            <div className="space-y-3">
              {dossiers.map((d: any) => (
                <Link
                  key={d.id}
                  href={`/app/admin/dossiers/${d.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-lg">
                        {d.profiles?.initial || "?"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {d.profiles?.full_name}
                      </p>
                      <p className="text-sm text-gray-500">{d.profiles?.email}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(d.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  <div className="ml-4">
                    {d.statut === "validé" && (
                      <Badge className="bg-green-600">Validé</Badge>
                    )}
                    {d.statut === "en attente" && (
                      <Badge className="bg-amber-500">En attente</Badge>
                    )}
                    {d.statut === "refusé" && (
                      <Badge className="bg-red-600">Refusé</Badge>
                    )}
                    {(d.statut === "en cours" || d.statut === "non_cree") && (
                      <Badge className="bg-gray-500">En cours</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}