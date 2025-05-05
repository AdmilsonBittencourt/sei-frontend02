"use client"

import type React from "react"

import { useState } from "react"
import type { Professor } from "../../types/interfaces"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProfessorForm } from "../professor/Professor-form"

interface ProfessorDialogProps {
  formData: Professor
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function ProfessorDialog({ formData, handleChange, handleSubmit, isLoading }: ProfessorDialogProps) {
  const [open, setOpen] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(e)
    setOpen(false) // Fecha o dialog após o envio bem-sucedido
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus size={18} />
          Adicionar Professor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="py-4">
          <ProfessorForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
