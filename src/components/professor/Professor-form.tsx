"use client"

import type React from "react"

import type { Professor } from "../../types/interfaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"

interface ProfessorFormProps {
  formData: Professor
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function ProfessorForm({ formData, handleChange, handleSubmit, isLoading }: ProfessorFormProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus size={20} />
          Novo Professor
        </CardTitle>
        <CardDescription>Preencha os dados para cadastrar um novo professor</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="CPF">CPF</Label>
            <Input
              id="CPF"
              name="CPF"
              placeholder="000.000.000-00"
              value={formData.CPF}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Input
              id="departamento"
              name="departamento"
              placeholder="Nome do departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar Professor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
