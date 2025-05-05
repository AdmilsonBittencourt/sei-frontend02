"use client"

import type { Professor } from "../../types/interfaces"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ProfessorListProps {
  professores: Professor[]
}

export function ProfessorList({ professores }: ProfessorListProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={20} />
          Professores Cadastrados
        </CardTitle>
        <CardDescription>
          {professores.length} {professores.length === 1 ? "professor" : "professores"} no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {professores.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nenhum professor cadastrado</div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {professores.map((professor) => (
                <div key={professor.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{professor.nome}</h3>
                      <Badge variant="outline">{professor.departamento}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{professor.email}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Tel: {professor.telefone}</span>
                      <span>CPF: {professor.CPF}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
