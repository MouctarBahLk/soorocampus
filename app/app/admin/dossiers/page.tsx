// app/app/admin/dossiers/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabaseServer } from "@/lib/supabase-server";
import { Search, Filter, CheckCircle, Clock, XCircle, FileText, ChevronRight } from "lucide-react";
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
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestion des dossiers</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">{dossiers.length} dossier(s) au total</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Rechercher..." className="pl-10 rounded-xl w-full" />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            <span className="sm:inline">Filtrer</span>
          </button>
        </div>
      </div>

      {/* Stats - Responsive Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-600">Total</p>
                <FileText className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
              </div>
              <p className="text-xl md:text-2xl font-bold">{dossiers.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-600">En attente</p>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-amber-600" />
              </div>
              <p className="text-xl md:text-2xl font-bold text-amber-600">
                {dossiers.filter((d: any) => d.statut === "en attente").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-600">Validés</p>
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {dossiers.filter((d: any) => d.statut === "validé").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-600">Refusés</p>
                <XCircle className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              </div>
              <p className="text-xl md:text-2xl font-bold text-red-600">
                {dossiers.filter((d: any) => d.statut === "refusé").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des dossiers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Tous les dossiers</CardTitle>
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
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-sm md:text-lg">
                      {d.profiles?.initial || "?"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {d.profiles?.full_name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">{d.profiles?.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5 md:hidden">
                      {new Date(d.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  {/* Date Desktop */}
                  <div className="hidden md:block text-sm text-gray-500">
                    {new Date(d.created_at).toLocaleDateString("fr-FR")}
                  </div>

                  {/* Badge */}
                  <div className="flex items-center gap-2">
                    {d.statut === "validé" && (
                      <Badge className="bg-green-600 text-xs">Validé</Badge>
                    )}
                    {d.statut === "en attente" && (
                      <Badge className="bg-amber-500 text-xs">En attente</Badge>
                    )}
                    {d.statut === "refusé" && (
                      <Badge className="bg-red-600 text-xs">Refusé</Badge>
                    )}
                    {(d.statut === "en cours" || d.statut === "non_cree") && (
                      <Badge className="bg-gray-500 text-xs">En cours</Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400 hidden sm:block" />
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