"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Professor } from "../../types/interfaces"
import { Button } from "@/components/ui/button"
import { UserPlus, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProfessorForm } from "../professor/Professor-form"

interface ProfessorDialogProps {
  formData: Professor
  handleSubmit: (professor: Professor) => void
  isLoading: boolean
  mode?: 'create' | 'edit'
  trigger?: React.ReactNode
}

export function ProfessorDialog({ 
  formData: initialFormData, 
  handleSubmit, 
  isLoading, 
  mode = 'create',
  trigger 
}: ProfessorDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(formData)
    setOpen(false)
  }

  const defaultTrigger = (
    <Button className="gap-2">
      {mode === 'create' ? (
        <>
          <UserPlus size={18} />
          Adicionar Professor
        </>
      ) : (
        <>
          <Pencil size={18} />
          <span className="sr-only">Editar</span>
        </>
      )}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="py-4">
          <ProfessorForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={onSubmit}
            isLoading={isLoading}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
