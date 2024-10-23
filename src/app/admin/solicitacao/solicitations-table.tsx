'use client'

import { useRouter } from "next/navigation"
import { deleteVisa, sendMessage, updateEmail, updateStatus } from "../actions"
import dynamic from 'next/dynamic'
import Image from "next/image"

const Select = dynamic(() => import('react-select'), { ssr: false })
import { Eye, Pencil, Trash2, X } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import LoadingSpinner from "@/app/components/loading-spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface updateStatus {
  id: string
  name: string
  email: string
  codeETA: string
  passportNumber: string
  statusETA: string
  attachment: string
}

interface updateEmail {
  id: string
  email: string
}

interface sendMessage {
  id: string
  message: string
}

export default function SolicitationsTable({ visas }: { visas: any[] }) {
  const [selectedVisa, setSelectedVisa] = useState<any | null>(null)
  const [updateProcess, setUpdateProcess] = useState<any | null>(null)
  const [deletedVisa, setDeletedVisa] = useState<any | null>(null)

  const router = useRouter()

  const handleDelete = async (id: string) => {
    try {
      await deleteVisa(id)
      setDeletedVisa(null)
      router.refresh()
      toast({
        title: "Deletado com sucesso",
        description: "Este cliente foi permanentemente deletado"
      })


    } catch(e) {
      console.log(e)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao deletar esta solicitação"
      })
    }
  }
  
  return (
    <div>
        {visas.map((visa: any, index: number) => (
          <div key={index}>
            <div className="flex justify-between items-center p-2 bg-gray-100">
              <h2 className="font-bold text-2xl">{`${visa.name} ${visa.surname}`}</h2>
              <span className="text-sm">Criado: {new Date(visa.createdAt).toLocaleString("pt-br")}</span>
            </div>
            <div className="bg-white flex flex-row justify-between items-center p-2">
              <div>
                { visa.imagePath ?
                  <>
                    <Image src={`${process.env.NEXT_PUBLIC_APP_URL}/${visa.imagePath}`} width={300} height={300} alt={visa.name + visa.surname} className="w-full max-w-[100px] aspect-[3/4] object-cover max-h-xs border-2 border-gray-300" />
                  </>
                  :
                  <div className="flex max-w-[180px] justify-center items-center aspect-[3/4] border-2 bg-gray-300">
                    <p className="text-center">Sem<br />imagem</p>
                  </div>
                }
              </div>
              <div className="px-8 w-full grid grid-cols-3">
                <div>
                  <p><b>Cód. acompanhamento:</b> {visa.codeETA}</p>
                  <p><b>Número passaporte:</b> {visa.passportNumber}</p>
                </div>
                <div>
                  <p><b>E-mail:</b> {visa.email}</p>
                  <p><b>Telefone:</b> {visa.telephone}</p>
                </div>
                <div>
                  <p><b>Status aplicação:</b> {visa.statusETA}</p>
                  <p><b>Pagamento:</b> {visa.payments[0]?.payment[0]?.status ? visa.payments[0]?.payment[0]?.status : "Sem pagamento" }</p>
                </div>
              </div>
              <div>
                <div className="flex flex-row justify-center flex-grow gap-6">
                  <AlertDialog open={updateProcess?.id === visa.id} onOpenChange={() => setUpdateProcess(visa)}>
                    <AlertDialogTrigger asChild>
                      <Pencil className="size-6 text-yellow-500 cursor-pointer"/>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="p-0">
                      { updateProcess && (
                        <>
                          <AlertDialogHeader className="p-4 border-b">
                            <div className="flex justify-between items-center">
                              <AlertDialogTitle className="text-2xl font-bold">Gerenciar solicitação</AlertDialogTitle>
                              <Button variant="ghost" size="icon" onClick={() => setUpdateProcess(null)}>
                                <X className="h-6 w-6" />
                              </Button>
                            </div>
                          </AlertDialogHeader>
                          <p className="px-4"><b>Cliente: {updateProcess.name + " " + updateProcess.surname}</b></p>
                          <Tabs defaultValue="update">
                            <TabsList className="w-full">
                              <TabsTrigger value="update">Atualizar status</TabsTrigger>
                              <TabsTrigger value="email">Atualizar e-mail</TabsTrigger>
                              <TabsTrigger value="message">Enviar mensagem</TabsTrigger>
                            </TabsList>

                            <TabsContent value="update">
                              <UpdateStatus data={{
                                id: updateProcess.id,
                                name: updateProcess.name,
                                email: updateProcess.email,
                                codeETA: updateProcess.codeETA,
                                passportNumber: updateProcess.passportNumber,
                                statusETA: "",
                                attachment: ""
                              }}/>
                            </TabsContent>

                            <TabsContent value="email">
                              <UpdateEmail data={{id: updateProcess.id, email: updateProcess.email}}/>
                            </TabsContent>

                            <TabsContent value="message">
                              <SendMessage data={{id: updateProcess.id, message: ""}} />
                            </TabsContent>
                          </Tabs>
                        </>
                      )}
                      <AlertDialogDescription className="hidden">
                        <p>Modal para atualizacão de Informações</p>
                      </AlertDialogDescription>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog open={selectedVisa?.id === visa.id} onOpenChange={() => setSelectedVisa(visa)}>
                    <AlertDialogTrigger asChild>
                      <Eye className="size-6 text-blue-500 cursor-pointer" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-full w-full h-full overflow-y-auto p-0">
                      <div className="container mx-auto h-full flex flex-col">
                        <AlertDialogHeader className="py-6 border-b">
                          <div className="flex justify-between items-center">
                            <AlertDialogTitle className="text-2xl font-bold">Dados da solicitação</AlertDialogTitle>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedVisa(null)}>
                              <X className="h-6 w-6" />
                            </Button>
                          </div>
                        </AlertDialogHeader>
                        {selectedVisa && (
                          <div className="grid grid-cols-2 gap-16 flex-grow overflow-auto p-6">
                            <div className="space-y-6 max-w-2xl mx-auto">
                              <h3 className="text-lg font-bold">Informações do aplicante</h3>
                              { selectedVisa.imagePath ? 
                                <>
                                  <Image src={`${process.env.NEXT_PUBLIC_APP_URL}/${selectedVisa.imagePath}`} width={300} height={300} alt={selectedVisa.name + " " + selectedVisa.surname} className="w-[180px] aspect-[3/4] object-cover border-2 border-gray-300" />
                                  <Button>
                                    <a href={`${process.env.NEXT_PUBLIC_APP_URL}/${selectedVisa.imagePath}`} download>
                                      Download da imagem
                                    </a>
                                  </Button>
                                </>
                                :
                                <div className="w-[180px] flex justify-center items-center aspect-[3/4] border-2 bg-gray-300">
                                  <p>Sem imagem</p>
                                </div>
                              }
                              {
                                selectedVisa.attachmentPath && (
                                  <Button>
                                    <a href={selectedVisa.attachmentPath} download>
                                      Download do NZeTA
                                    </a>
                                  </Button>
                                )
                              }
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Nacionalidade do passaporte</Label>
                                  <Input id="name" value={selectedVisa.passportNationality} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="name">País emissor do passaporte</Label>
                                  <Input id="name" value={selectedVisa.passportNationality} readOnly />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="passport">Passaporte</Label>
                                  <Input id="passport" value={selectedVisa.passportNumber} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="passport">Validade do passaporte</Label>
                                  <Input id="passport" value={new Date(selectedVisa.passportExpiration).toLocaleDateString()} readOnly />
                                </div>
                              </div>
                              <hr />
                              <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={selectedVisa.name} readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="name">Sobrenome</Label>
                                <Input id="name" value={selectedVisa.surname} readOnly />
                              </div>
                              <div>
                                <Label>Já possuiu um nome diferente?</Label>
                                <div className="mt-2">
                                  <RadioGroup
                                    className="flex flex-row gap-5"
                                    disabled
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="true"
                                        id="had-other-name-option-yes"
                                        checked={selectedVisa?.hadOtherName}
                                      />
                                      <Label htmlFor="had-other-name-option-yes">Sim</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="false"
                                        id="had-other-name-option-no"
                                        checked={!selectedVisa?.hadOtherName}
                                      />
                                      <Label htmlFor="had-other-name-option-no">Não</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              {selectedVisa?.hadOtherName && selectedVisa?.otherName && (
                                <div>
                                  <Label htmlFor="user_othername">Insira seu outro nome completo</Label>
                                  <Input type="text" id="user_othername" className="md:w-1/2" readOnly/>
                                </div>
                              )}
                              
                              <div>
                                <Label>Selecione seu gênero conforme consta em seu passaporte.</Label>
                                <div className="mt-2">
                                  <RadioGroup disabled>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="Masculino" id="user_gender-m" checked={selectedVisa?.gender === "Masculino"} />
                                      <Label htmlFor="user_gender-m">Masculino</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="Feminino" id="user_gender-f" checked={selectedVisa?.gender === "Feminino"} />
                                      <Label htmlFor="user_gender-f">Feminino</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="Gênero diverso" id="user_gender-d" checked={selectedVisa?.gender === "Gênero diverso"} />
                                      <Label htmlFor="user_gender-d">Gênero diverso</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="passport">Data de nascimento</Label>
                                <Input id="passport" value={new Date(selectedVisa.dateBirth).toLocaleDateString()} readOnly />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="passport">Local de nascimento</Label>
                                  <Input id="passport" value={selectedVisa.cityBirth} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="passport">País de nascimento</Label>
                                  <Input id="passport" value={selectedVisa.countryBirth} readOnly />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="email">Email</Label>
                                  <Input id="email" type="email" value={selectedVisa.email} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email">Celular</Label>
                                  <Input id="email" type="email" value={selectedVisa.telephone} readOnly />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">CPF</Label>
                                <Input id="email" type="email" value={selectedVisa.nationalDocument} readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label>Residente permanente na Austrália e tem um visto que permite retornar à Austrália?</Label>
                                <div className="mt-2">
                                  <RadioGroup
                                    className="flex flex-row gap-5"
                                    disabled
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="true"
                                        id="option-one"
                                        checked={selectedVisa.returnToAustralia}
                                      />
                                      <Label htmlFor="option-one">Sim</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="false"
                                        id="option-two"
                                        checked={!selectedVisa.returnToAustralia}
                                      />
                                      <Label htmlFor="option-two">Não</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>
                                  Você vai permanecer na Nova Zelândia ou é apenas trânsito?
                                </Label>
                                <div className="mt-2">
                                  <RadioGroup
                                    className="flex flex-row gap-5"
                                    required
                                    disabled
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="true"
                                        id="stay-nz-yes"
                                        checked={selectedVisa.stayInNZ}
                                      />
                                      <Label htmlFor="stay-nz-yes">Sim, vou permanecer</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="false"
                                        id="stay-nz-no"
                                        checked={!selectedVisa.stayInNZ}
                                      />
                                      <Label htmlFor="stay-nz-no">Não, apenas trânsito</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              <hr />
                              <div>
                                <Label>Viajará para a Nova Zelândia para consulta ou tratamento médico?</Label>
                                <div className="mt-2">
                                  <RadioGroup className="flex flex-row gap-5" disabled>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="1"
                                        id="option-one"
                                        checked={selectedVisa.medicalTreatment}
                                      />
                                      <Label htmlFor="option-one">Sim</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="0"
                                        id="option-two"
                                        checked={!selectedVisa.medicalTreatment}
                                      />
                                      <Label htmlFor="option-two">Não</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              <div>
                                <Label>Já foi deportado, removido ou excluído de outro país (não da Nova Zelândia)?</Label>
                                <div className="mt-2">
                                  <RadioGroup className="flex flex-row gap-5" disabled>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="1"
                                        id="option-one"
                                        checked={selectedVisa.beenDeported}
                                      />
                                      <Label htmlFor="option-one">Sim</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="0"
                                        id="option-two"
                                        checked={!selectedVisa.beenDeported}
                                      />
                                      <Label htmlFor="option-two">Não</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              <div>
                                <Label>Está atualmente proibido de entrar na Nova Zelândia após ter sido deportado da Nova Zelândia no passado?</Label>
                                <div className="mt-2">
                                  <RadioGroup className="flex flex-row gap-5" disabled>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="1"
                                        id="option-one"
                                        checked={selectedVisa?.forbiddenEnter}
                                      />
                                      <Label htmlFor="option-one">Sim</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="0"
                                        id="option-two"
                                        checked={!selectedVisa?.forbiddenEnter}
                                      />
                                      <Label htmlFor="option-two">Não</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              <div>
                                <Label>Já foi condenado por algum crime (em algum país)?</Label>
                                <div className="mt-2">
                                  <RadioGroup className="flex flex-row gap-5" disabled>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="1"
                                        id="option-one"
                                        checked={selectedVisa?.beenConvicted}
                                      />
                                      <Label htmlFor="option-one">Sim</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="0"
                                        id="option-two"
                                        checked={!selectedVisa?.beenConvicted}
                                      />
                                      <Label htmlFor="option-two">Não</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              { selectedVisa.beenConvicted && (
                                <div className="space-y-2">
                                  <Label>Já foi condenado por um crime pelo qual foi sentenciado a cinco anos ou mais de prisão? </Label>
                                  <div>
                                    <RadioGroup className="flex flex-row gap-5" disabled>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="true"
                                          id="option-one"
                                          checked={selectedVisa.convictedMoreThanFive}
                                        />
                                        <Label htmlFor="option-one">Sim</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="false"
                                          id="option-two"
                                          checked={!selectedVisa.convictedMoreThanFive}
                                        />
                                        <Label htmlFor="option-two">Não</Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                  { !selectedVisa.convictedMoreThanFive &&
                                    <div className="space-y-2">
                                      <Label>Nos últimos 10 anos foi condenado por um crime pelo qual foi condenado a uma pena de prisão igual ou superior a 12 meses?</Label>
                                      <div>
                                        <RadioGroup className="flex flex-row gap-5" disabled>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                              value="true"
                                              id="option-one"
                                              checked={selectedVisa.convictedMoreThanTwelve}
                                            />
                                            <Label htmlFor="option-one">Sim</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                              value="false"
                                              id="option-two"
                                              checked={!selectedVisa.convictedMoreThanTwelve}
                                            />
                                            <Label htmlFor="option-two">Não</Label>
                                          </div>
                                        </RadioGroup>
                                      </div>
                                    </div>
                                  }
                                </div>
                              )}
                            </div>
                            <div className="space-y-6 max-w-2xl mx-auto">
                              <h3 className="text-lg font-bold">Informações de pagamento</h3>
                              <div className="grid grid-cols-2 gap-4">
                                { selectedVisa.payments.map(({payment}: any, index: number) => (
                                  <Card key={index}>
                                    <CardHeader>Tentativa de pagamento #{index+1}</CardHeader>
                                    <CardContent>
                                      <p>Valor: {payment.transactionAmount}</p>
                                      <p>Status: {payment.status}</p>
                                      <p>Método de pagamento: {payment.paymentTypeId === "pix" ? "Pix" : "Cartão de crédito"}</p>
                                      <hr className="my-2"/>
                                      <p>Criado em: {new Date(payment.createdAt).toLocaleDateString()}</p>
                                    </CardContent>
                                  </Card>
                                )) }
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <AlertDialogDescription className="hidden">
                        <p>Modal para exibição de Informações</p>
                      </AlertDialogDescription>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog open={deletedVisa?.id === visa.id} onOpenChange={() => setDeletedVisa(visa)}>
                    <AlertDialogTrigger asChild>
                      <Trash2 className="size-6 text-red-500 cursor-pointer"/>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader className="pb-6 border-b">
                        <div className="flex justify-between items-center">
                          <AlertDialogTitle className="text-2xl font-bold">Tem certeza?</AlertDialogTitle>
                          <Button variant="ghost" size="icon" onClick={() => setDeletedVisa(null)}>
                            <X className="h-6 w-6" />
                          </Button>
                        </div>
                      </AlertDialogHeader>
                      <div className="space-y-4">
                        <h2>Você realmente deseja excluir a solicitação deste cliente?</h2>
                        { deletedVisa && (
                          <b>Cliente: {deletedVisa.name + " " + deletedVisa.surname}</b>
                        )}
                        <div className="flex flex-row gap-4">
                          <Button variant="destructive" onClick={() => handleDelete(deletedVisa.id)}>Excluir</Button>
                          <Button variant="outline" onClick={() => setDeletedVisa(null)}>Cancelar</Button>
                        </div>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                </div>
              </div>
            </div>
            <hr className="border-black" />
          </div>
        ))}
    </div>
  )
}

function UpdateStatus({data}: {data: updateStatus}) {
  const [attachment, setAttachment] = useState<string | null>(null)
  const [checkStatusEta, setCheckStatusEta] = useState<boolean>(false)

  const { register, handleSubmit, setValue, formState } = useForm<updateStatus>()

  const router = useRouter()

  const handleStatusEta = (selectedOption: any) => {
    if (selectedOption.value === "Aprovado" || selectedOption.value === "Recusado") {
      setCheckStatusEta(true)
    } else {
      setCheckStatusEta(false)
    }
    setValue('statusETA', selectedOption.value)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAttachment(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit: SubmitHandler<updateStatus> = async (data) => {
    try {
      if(attachment) {
        const blob = await (await fetch(attachment)).blob()
        const formData = new FormData()
        formData.append('file', blob, `${new Date().getTime()}_${data.passportNumber}_${data.name}.pdf`)
  
        // Primeiro, faça o upload do NZeTA
        const uploadResponse = await fetch('/api/upload-eta', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadResponse.json()

        if (uploadResponse.ok && uploadData.imagePath) {
          await updateStatus({
            ...data,
            attachment: uploadData.imagePath
          })

          router.refresh()

          toast({
            variant: "success",
            title: "Atualizado com sucesso",
            description: "O status desta solicitação foi atualizado com sucesso"
          })
        }
      } else {
        await updateStatus({
          ...data,
          attachment: null
        })

        router.refresh()

        toast({
          variant: "success",
          title: "Atualizado com sucesso",
          description: "O status desta solicitação foi atualizado com sucesso"
        })
      }
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <form className="space-y-4 pb-4 px-4" onSubmit={handleSubmit(onSubmit)}>
      <Input value={data.id} className="hidden" {...register('id')}/>
      <Input value={data.name} className="hidden" {...register('name')}/>
      <Input value={data.email} className="hidden" {...register('email')}/>
      <Input value={data.codeETA} className="hidden" {...register('codeETA')}/>
      <Input value={data.passportNumber} className="hidden" {...register('passportNumber')}/>
      <div>
        <Label>Status da aplicação:</Label>
        <Select 
          options={[
            { value: "Em análise", label: "Em análise"},
            { value: "Recebido pelo Governo da Nova Zelândia", label: "Recebido pelo Governo da Nova Zelândia"},
            { value: "Aprovado", label: "Aprovado"},
            { value: "Recusado", label: "Recusado"},
          ]}
          placeholder="Selecione"
          onChange={handleStatusEta}
          required
        />
      </div>
      { checkStatusEta && 
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="attachment">Anexo do processo</Label>
          <Input id="attachment" type="file" accept="application/pdf" onChange={handleFileChange} required />
        </div>
      }
      <Button type="submit" disabled={formState.isSubmitting}>
        { formState.isSubmitting ? <><p>Atualizando status...</p><LoadingSpinner /></> : "Atualizar status" }
      </Button>
    </form>
  )
}

function UpdateEmail({data}: {data: updateEmail}) {
  const { register, handleSubmit, formState } = useForm<updateEmail>()
  const router = useRouter()
  
  const handleUpdateEmail: SubmitHandler<updateEmail> = async (data) => {
    try {
      await updateEmail(data)

      router.refresh()

      toast({
        variant: "success",
        title: "Atualizado com sucesso",
        description: "O e-mail deste cliente foi atualizado com sucesso"
      })
    } catch(e) {
      console.log(e)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o e-mail deste cliente"
      })
    }
  }

  return (
    <form className="space-y-4 pb-4 px-4" onSubmit={handleSubmit(handleUpdateEmail)}>
      <Input value={data.id} className="hidden" {...register('id')} />
      <div>
        <Label>E-mail atual</Label>
        <Input 
          defaultValue={data.email}
          {...register('email')}
        /> 
      </div>
      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? <><p>Atualizando e-mail...</p><LoadingSpinner /></> : "Atualizar e-mail"}
      </Button>
    </form>
  )
}

function SendMessage({data}: {data: sendMessage}) {
  const { register, handleSubmit, formState } = useForm<sendMessage>()
  const router = useRouter()
  
  const handleSendMessage: SubmitHandler<sendMessage> = async (data) => {
    try {
      await sendMessage(data)

      router.refresh()

      toast({
        variant: "success",
        title: "Mensagem adicionada",
        description: "A mensagem foi adicionada com sucesso"
      })
    } catch(e) {
      console.log(e)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o e-mail deste cliente"
      })
    }
  }

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit(handleSendMessage)}>
      <Input value={data.id} className="hidden" {...register('id')} />
      <div>
        <Label htmlFor="message">Mensagem ao aplicante:</Label>
        <Textarea id="message" {...register('message')} />
      </div>
      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? <><p>Adicionando...</p><LoadingSpinner /></> : "Adicionar mensagem"}
      </Button>
    </form>
  )
}
