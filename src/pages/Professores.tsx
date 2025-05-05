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
      setProfessores(res.data)
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

  const handleEdit = (professor: Professor) => {
    toast({
      title: "Editar Professor",
      description: `Você selecionou o professor ${professor.nome} para edição.`,
    })
  }

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return

    try {
      // Implementação futura: excluir professor
      toast({
        title: "Excluir Professor",
        description: `Você selecionou o professor ID: ${id} para exclusão.`,
      })
    } catch (error) {
      console.error("Erro ao excluir professor:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o professor.",
        variant: "destructive",
      })
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
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        <ProfessorList professores={professores} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  )
}
