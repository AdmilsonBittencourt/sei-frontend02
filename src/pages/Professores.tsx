"use client"

import type React from "react"

import { useEffect, useState } from "react"
import api from "../api/axios"
import type { Professor } from "../types/interfaces"
import { ProfessorDialog } from "../components/professor/Professor-dialog"
import { ProfessorList } from "../components/professor/Professor-list"
import { useToast } from "@/hooks/use-toast"

export default function Professores() {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [formData, setFormData] = useState<Professor>({
    nome: "",
    email: "",
    telefone: "",
    CPF: "",
    departamento: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchProfessores = async () => {
    try {
      const res = await api.get("/professores")
      // Ordenar os professores por ID para manter a ordem original
      const professoresOrdenados = res.data.sort((a: Professor, b: Professor) => {
        if (a.id && b.id) {
          return Number(a.id) - Number(b.id)
        }
        return 0
      })
      setProfessores(professoresOrdenados)
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
    setIsLoading(true)

    try {
      await api.post("/professores", formData)
      setFormData({ nome: "", email: "", telefone: "", CPF: "", departamento: "" })
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
      setIsLoading(true) // Adiciona loading state
      const response = await api.patch(`/professores/${id}/desativar`)
      
      if (response.status === 200 || response.status === 204) {
        fetchProfessores()
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
      setIsLoading(false) // Remove loading state
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
                handleSubmit(new Event('submit') as unknown as React.FormEvent);
              }
            }}
            isLoading={isLoading}
          />
        </div>

        <ProfessorList 
          professores={professores} 
          onView={handleView} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  )
}
