"use client"

import type React from "react"

import { useEffect, useState } from "react"
import api from "../api/axios"
import type { Professor } from "../types/interfaces"
import { ProfessorDialog } from "../components/professor/Professor-dialog"
import { ProfessorList } from "../components/professor/Professor-list"
import { useToast } from "@/hooks/use-toast"

export default function Professores() {
  const [professoresAtivos, setProfessoresAtivos] = useState<Professor[]>([])
  const [professoresInativos, setProfessoresInativos] = useState<Professor[]>([])
  const [formData, setFormData] = useState<Professor>({
    nome: "",
    email: "",
    telefone: "",
    CPF: "",
    departamento: "",
    ativo: true  // Adicionando o campo ativo com valor padrão true
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchProfessores = async () => {
    try {
      const res = await api.get("/professores")
      const professores = res.data.sort((a: Professor, b: Professor) => {
        if (a.id && b.id) {
          return Number(a.id) - Number(b.id)
        }
        return 0
      })
      
      // Modificando a lógica de filtro para ser mais flexível
      const ativos = professores.filter((prof: Professor) => prof.ativo)
      const inativos = professores.filter((prof: Professor) => !prof.ativo)
      
      console.log('Professores recebidos:', professores)
      console.log('Ativos:', ativos)
      console.log('Inativos:', inativos)
      
      setProfessoresAtivos(ativos)
      setProfessoresInativos(inativos)
    } catch (error) {
      console.error("Erro ao buscar professores:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de professores.",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação dos campos obrigatórios
    if (!formData.nome || !formData.email || !formData.CPF) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)

    try {
      const professorData = {
        ...formData,
        ativo: true // Garantindo que o campo ativo seja enviado
      };
      await api.post("/professores", professorData)
      setFormData({ nome: "", email: "", telefone: "", CPF: "", departamento: "", ativo: true })
      fetchProfessores()
      toast({
        title: "Sucesso",
        description: "Professor cadastrado com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error)
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o professor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleView = (professor: Professor) => {
    toast({
      title: "Visualizar Professor",
      description: `Você está visualizando o professor ${professor.nome}.`,
    })
  }

  const handleEdit = async (professor: Professor) => {
    setIsLoading(true)
  
    try {
      await api.put(`/professores/${professor.id}`, professor)
      fetchProfessores()
      toast({
        title: "Sucesso",
        description: `Professor ${professor.nome} atualizado com sucesso!`,
      })
    } catch (error) {
      console.error("Erro ao editar professor:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados do professor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return

    // Confirmação antes de excluir
    if (!window.confirm("Tem certeza que deseja desativar este professor?")) {
      return
    }

    try {
      setIsLoading(true)
      const response = await api.patch(`/professores/${id}/desativar`)
      
      if (response.status === 200 || response.status === 204) {
        // Apenas busca os dados atualizados do backend
        await fetchProfessores()
        
        toast({
          title: "Sucesso",
          description: "Professor desativado com sucesso!",
        })
      } else {
        throw new Error("Erro ao desativar professor")
      }
    } catch (error: any) {
      console.error("Erro ao desativar professor:", error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível desativar o professor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfessores()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Cadastro de Professores</h1>
          <ProfessorDialog
            formData={formData}
            handleSubmit={(professor: Professor) => {
              if (professor.id) {
                handleEdit(professor);
              } else {
                // Corrigindo a submissão do novo professor
                const newProfessor = {
                  ...professor,
                  ativo: true
                };
                setFormData(newProfessor);
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }
            }}
            isLoading={isLoading}
          />
        </div>

        <div className="space-y-8">
          {/* Lista de Professores Ativos */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Professores Ativos</h2>
            <ProfessorList 
              professores={professoresAtivos} 
              onView={handleView} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </div>

          {/* Lista de Professores Inativos */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Professores Inativos</h2>
            <ProfessorList 
              professores={professoresInativos} 
              onView={handleView} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              isInactive
            />
          </div>
        </div>
      </div>
    </div>
  )
}
