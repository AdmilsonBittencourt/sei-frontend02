"use client"

import { useState } from "react"
import type { Professor } from "../../types/interfaces"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, Pencil, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProfessorListProps {
  professores: Professor[]
  onEdit?: (professor: Professor) => void
  onDelete?: (id: string | number | undefined) => void
}

export function ProfessorList({ professores, onEdit, onDelete }: ProfessorListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtra os professores com base no termo de busca
  const filteredProfessores = professores.filter((professor) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      professor.nome.toLowerCase().includes(searchLower) ||
      professor.email.toLowerCase().includes(searchLower) ||
      professor.departamento.toLowerCase().includes(searchLower) ||
      professor.CPF.includes(searchTerm) ||
      professor.telefone.includes(searchTerm)
    )
  })

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Professores Cadastrados
          </CardTitle>
          <Badge variant="outline">
            {professores.length} {professores.length === 1 ? "professor" : "professores"}
          </Badge>
        </div>
        <CardDescription>Gerencie os professores cadastrados no sistema</CardDescription>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar professor..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredProfessores.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Nenhum professor encontrado para esta busca" : "Nenhum professor cadastrado"}
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredProfessores.map((professor) => (
                <div key={professor.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{professor.nome}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{professor.email}</p>
                    
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Tel: {professor.telefone}</span>
                      <span>CPF: {professor.CPF}</span>
                      <Badge variant="outline">{professor.departamento}</Badge>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-blue-600"
                        onClick={() => onEdit && onEdit(professor)}
                      >
                        <Pencil size={16} className="mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-red-600"
                        onClick={() => onDelete && onDelete(professor.id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Excluir
                      </Button>
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
