'use client'

import Image from "next/image"
import dynamic from 'next/dynamic'

const Select = dynamic(() => import('react-select'), { ssr: false })
import { Eye, MessageSquare, X } from "lucide-react"
import { useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


export default function SolicitationsTable({ visas }: { visas: any[] }) {
  const [selectedVisa, setSelectedVisa] = useState<any | null>(null)
  const [updateProcess, setUpdateProcess] = useState<any | null>(null)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px] text-center">Foto</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Celular</TableHead>
          <TableHead>Passaporte</TableHead>
          <TableHead>Código NZeTA</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visas.map((visa: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              { visa.imagePath ?
                <Image src={`${visa.imagePath}`} width={300} height={300} alt={visa.name + visa.surname} className="w-full aspect-[3/4] object-cover max-w-xs max-h-xs border-2 border-gray-300" />
                :
                <div className="flex justify-center items-center aspect-[3/4] border-2 bg-gray-300">
                  <p className="text-center">Sem<br />imagem</p>
                </div>
              }
            </TableCell>
            <TableCell>
              <p>{visa.name + " " + visa.surname}</p>
            </TableCell>
            <TableCell>
              <p>{visa.email}</p>
            </TableCell>
            <TableCell>
              <p>{visa.telephone}</p>
            </TableCell>
            <TableCell>
              <p>{visa.passportNumber}</p>
            </TableCell>
            <TableCell>
              <p>{visa.codeETA}</p>
            </TableCell>
            <TableCell>
              <div className="flex flex-row justify-center flex-grow gap-6">
                <AlertDialog key={visa.id} open={updateProcess?.id === visa.id} onOpenChange={() => setUpdateProcess(visa)}>
                  <AlertDialogTrigger asChild>
                    <MessageSquare className="size-6 text-yellow-500 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="p-0">
                    { updateProcess && (
                      <>
                        <AlertDialogHeader className="p-4 border-b">
                          <div className="flex justify-between items-center">
                            <AlertDialogTitle className="text-2xl font-bold">Dados da solicitação</AlertDialogTitle>
                            <Button variant="ghost" size="icon" onClick={() => setUpdateProcess(null)}>
                              <X className="h-6 w-6" />
                            </Button>
                          </div>
                        </AlertDialogHeader>
                        <form className="space-y-4 pb-4 px-4">
                          <p><b>Cliente: {updateProcess.name + " " + updateProcess.surname}</b></p>
                          <div>
                            <Label>Status da aplicação:</Label>
                            <Select 
                              options={[
                                { value: "Em análise", label: "Em análise"},
                                { value: "Recebido pelo Governo Canadense", label: "Recebido pelo Governo Canadense"},
                                { value: "Aprovado", label: "Aprovado"},
                                { value: "Recusado", label: "Recusado"},
                              ]}
                              placeholder="Selecione"
                            />
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="picture">Anexo do processo</Label>
                            <Input id="picture" type="file" />
                          </div>
                          <Button type="submit">
                            Atualizar processo
                          </Button>
                        </form>
                        <hr />
                        <form action="" className="p-4 space-y-4">
                          <div>
                            <Label>Mensagem ao aplicante:</Label>
                            <Textarea name="" id="" />
                          </div>
                          <Button>
                            Enviar
                          </Button>
                        </form>
                      </>
                    )}
                    <AlertDialogDescription className="hidden">
                      <p>Modal para atualizacão de Informações</p>
                    </AlertDialogDescription>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog key={visa.id} open={selectedVisa?.id === visa.id} onOpenChange={() => setSelectedVisa(visa)}>
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
                                <Image src={`${selectedVisa.imagePath}`} width={300} height={300} alt={selectedVisa.name + " " + selectedVisa.surname} className="w-[180px] aspect-[3/4] object-cover border-2 border-gray-300" />
                                <Button>
                                  <a href={selectedVisa.imagePath} download>
                                    Download da imagem
                                  </a>
                                </Button>
                              </>
                              :
                              <div className="w-[180px] flex justify-center items-center aspect-[3/4] border-2 bg-gray-300">
                                <p>Sem imagem</p>
                              </div>
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
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
