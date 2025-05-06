"use client"

import { useState } from "react"
import type { Professor } from "../../types/interfaces"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProfessorDialog } from "../../components/professor/Professor-dialog"

interface ProfessorListProps {
  professores: Professor[]
  onEdit?: (professor: Professor) => void
  onDelete?: (id: string | number | undefined) => void
  onView?: (professor: Professor) => void
  isInactive?: boolean
}

export function ProfessorList({ professores, onEdit, onDelete, onView, isInactive }: ProfessorListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Remova a função handleChange que estava lançando erro
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

  // Calcula o total de páginas
  const totalPages = Math.ceil(filteredProfessores.length / itemsPerPage)

  // Obtém os professores da página atual
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProfessores.slice(indexOfFirstItem, indexOfLastItem)

  // Funções de navegação
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <Card className={`shadow-md ${isInactive ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Professores Cadastrados
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Total: {filteredProfessores.length} {filteredProfessores.length === 1 ? "professor" : "professores"}
          </div>
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
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((professor, index) => (
                    <TableRow key={professor.id} className={isInactive ? 'bg-gray-50' : ''}>
                      <TableCell className="font-medium">{indexOfFirstItem + index + 1}</TableCell>
                      <TableCell>{professor.nome}</TableCell>
                      <TableCell>{professor.email}</TableCell>
                      <TableCell>{professor.telefone}</TableCell>
                      <TableCell>{professor.CPF}</TableCell>
                      <TableCell>{professor.departamento}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <ProfessorDialog
                            formData={professor}
                            handleSubmit={(updatedProfessor) => onEdit && onEdit(updatedProfessor)}
                            isLoading={false}
                            mode="edit"
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-amber-600"
                              >
                                <span className="sr-only">Editar</span>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => onDelete && onDelete(professor.id)}
                          >
                            <span className="sr-only">Excluir</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between space-x-6 mt-4">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}, mostrando {currentItems.length} registros de um total de{" "}
                  {filteredProfessores.length}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    // Lógica para mostrar páginas ao redor da página atual
                    let pageNum = currentPage
                    if (currentPage === 1) {
                      pageNum = i + 1
                    } else if (currentPage === totalPages) {
                      pageNum = totalPages - 2 + i
                    } else {
                      pageNum = currentPage - 1 + i
                    }

                    // Garantir que a página está dentro dos limites
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    }
                    return null
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
