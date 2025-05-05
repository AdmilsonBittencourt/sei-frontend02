"use client"

import type React from "react"

import { useEffect, useState } from "react"
import api from "../api/axios"
import type { Professor } from "../types/interfaces"
import { ProfessorDialog } from "../components/professor/Professor-dialog"
import { ProfessorList } from "../components/professor/Professor-list"

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

  const fetchProfessores = async () => {
    try {
      const res = await api.get("/professores")
      setProfessores(res.data)
    } catch (error) {
      console.error("Erro ao buscar professores:", error)
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
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfessores()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Cadastro de Professores</h1>
          <ProfessorDialog
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        <ProfessorList professores={professores} />
      </div>
    </div>
  )
}
