'use client'

import { useRouter } from "next/navigation"
import { createVisa } from "@/app/actions"
import dynamic from "next/dynamic"

import { useForm, SubmitHandler } from "react-hook-form"
const Select = dynamic(() => import('react-select'), { ssr: false })
import { useState, useEffect } from "react"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from '@/components/ui/use-toast'
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { WarningDiamond } from "@phosphor-icons/react/dist/ssr"

import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

interface ErrorMsg {
  [key: string]: string | undefined
}

interface FormData {
  passportNationality: string
  passportIssuer: string
  passportNumber: string
  passportExpiration: Date
  name: string
  surname: string
  hadOtherName: boolean
  otherName?: string
  gender: string
  dateBirth: Date
  cityBirth: string
  countryBirth: string
  email: string
  telephone: string
  nationalDocument: string
  returnToAustralia: boolean
  stayInNZ: boolean
  medicalTreatment: boolean
  beenDeported: boolean
  forbiddenEnter: boolean
  beenConvicted: boolean
  convictedMoreThanFive: boolean
  convictedMoreThanTwelve: boolean
}

export default function Data () {
  const [errors, setErrors] = useState<ErrorMsg>({})
  const [traveller, setTraveller] = useState(false)
  const [otherName, setOtherName] = useState(false)
  const [firstEmail, setFirstEmail] = useState("")
  const [secondEmail, setSecondEmail] = useState("")
  const [emailTimeout, setEmailTimeout] = useState<number | null>(null)
  const [returnToAustralia, setReturnToAustralia] = useState<string | null>(null)
  const [stayInNZ, setStayInNZ] = useState<string | null>(null)
  const [forbiddenEnter, setForbiddenEnter] = useState(false)
  const [beenConvicted, setBeenConvicted] = useState(false)
  const [beenDeported, setBeenDeported] = useState(false)
  const [convictedMoreThanFive, setConvictedMoreThanFive] = useState(false)
  const [convictedMoreThanTwelve, setConvictedMoreThanTwelve] = useState(false)
  const [gender, setGender] = useState("")
  
  const router = useRouter()
  const { register, handleSubmit, setValue, formState } = useForm<FormData>()

  setValue('passportNationality', 'Brasil')
  setValue('passportIssuer', 'Brasil')
  setValue('countryBirth', 'Brasil')

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const visa: any = await createVisa({
        ...data,
        gender,
        beenConvicted,
        beenDeported,
        convictedMoreThanFive,
        convictedMoreThanTwelve,
        forbiddenEnter,
        hadOtherName: otherName,
        returnToAustralia,
        stayInNZ,
        email: firstEmail
      })
      localStorage.setItem('visaId', visa.id)
      router.push('/aplicacao/foto')
    } catch (e) {
      console.log(e)
      toast({
        variant: "destructive",
        title: 'Erro',
        description: 'Um erro ocorreu ao prosseguir para a sua foto'
      })
    } finally {
      router.refresh()
    }
  }

  const handleTraveller = (e: React.ChangeEvent<HTMLInputElement>) => {
    const choosedDate = new Date(e.target.value)
    const currentDate = new Date()

    if (choosedDate.getTime() > currentDate.getTime()) { 
      setTraveller(true)
      setErrors(prev => ({ ...prev, passportExpiration: undefined })) // Limpa a mensagem de erro
    } else {
      setTraveller(false)
      setErrors(prev => ({ ...prev, passportExpiration: "A data de validade do passaporte deve ser futura." })) // Define a mensagem de erro
    }
  }

  // Função de debounce
  const debounce = (callback: Function, delay: number) => {
    if (emailTimeout) clearTimeout(emailTimeout)
    setEmailTimeout(window.setTimeout(() => callback(), delay))
  }

  // Função para verificar se os e-mails são iguais
  const emailIsValid = (firstEmail: string, secondEmail: string) => firstEmail === secondEmail

  useEffect(() => {
    const validationErrors: ErrorMsg = {}

    if (!emailIsValid(firstEmail, secondEmail)) {
      validationErrors['comparing-emails'] = 'Os e-mails informados não são iguais.'
    } else {
      delete validationErrors['comparing-emails'] // Remove o erro se os e-mails coincidirem
    }

    setErrors(validationErrors)
  }, [firstEmail, secondEmail])

  const handleRadioChange = (value: string) => setOtherName(value === "true")

  const handleFirstEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setFirstEmail(email)
    debounce(() => setFirstEmail(email), 500)
  }

  const handleSecondEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setSecondEmail(email)
    debounce(() => setSecondEmail(email), 500)
  }

  const handleNationalityChange = (selectedOption: any) => setValue('passportNationality', selectedOption.value)

  const handleIssuerChange = (selectedOption: any) => setValue('passportIssuer', selectedOption.value)

  const handleCountryBirthChange = (selectedOption: any) => setValue('countryBirth', selectedOption.value)

  const handleRadioReturnToAustralia = (value: string) => {
    setReturnToAustralia(value)
    if (value === 'false') {
      setStayInNZ(null)
    }
  }

  const handleRadioGender = (value: string) => setGender(value)

  const handleRadioForbiddenEnter = (value: string) => setForbiddenEnter(value === "true")
  
  const handleRadioBeenConvicted = (value: string) => setBeenConvicted(value === "true")

  const handleRadioBeenDeported = (value: string) => setBeenDeported(value === "true")

  const handleRadioConvictedMoreThanFive = (value: string) => setConvictedMoreThanFive(value === "true")

  const handleRadioConvictedMoreThanTwelve = (value: string) => setConvictedMoreThanTwelve(value === "true")

  return (
    <>
      <Header />
      <main className="container mx-auto my-16">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Solicitação de Autorização Eletrônica de Viagem (NZeTA)</h1>
          <hr />
          <h2 className="text-2xl font-bold">Progresso da sua aplicação</h2>
          <Progress value={25}/>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-stretch space-y-8">
            <Card id="passport">
              <CardHeader>
                <h3 className="text-lg font-bold">Detalhes do passaporte</h3>
              </CardHeader>
              <hr />
              <CardContent className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>
                    Selecione sua nacionalidade conforme mostrado no passaporte com o qual você viajará. <Required/>
                    <Tip content='Encontre o campo denominado "Nacionalidade" no seu passaporte.'/>
                  </Label>
                  <Select
                    options={countries}
                    defaultValue={{ label: "Brasil", value: "Brasil" }}
                    className="md:w-1/2"
                    onChange={handleNationalityChange}
                    isSearchable
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Selecione o país ou território emissor conforme mostrado no seu passaporte. <Required/>
                    <Tip content='Encontre o campo denominado "Código", "País emissor" ou "Código do país" em seu passaporte.'/>
                  </Label>
                  <Select
                    options={countries}
                    defaultValue={{ label: "Brasil", value: "Brasil" }}
                    className="md:w-1/2"
                    onChange={handleIssuerChange}
                    isSearchable
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport_number">Digite o número do seu passaporte exatamente como aparece no mesmo, incluindo letras e números. <Required/></Label>
                  <Input type="text" id="passport_number" className="md:w-1/2" required {...register('passportNumber')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport_expiration">Selecione a data de validade conforme mostrado no seu passaporte. <Required/></Label>
                  <Input type="date" id="passport_expiration" className="md:w-1/2" required {...register('passportExpiration')} onChange={handleTraveller}/>
                  {errors.passportExpiration && <p className="text-red-500">{errors.passportExpiration}</p>}
                </div>
              </CardContent>
            </Card>

            { traveller && 
              <>
                <Card id="traveller">
                  <CardHeader>
                    <h3 className="text-lg font-bold">Detalhes do passageiro</h3>
                  </CardHeader>
                  <hr />
                  <CardContent className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="user_name">Digite seu(s) nome(s) incluindo seu(s) nome(s) do meio conforme mostrado em seu passaporte. <Required/></Label>
                      <Input type="text" id="user_name" className="md:w-1/2" required {...register('name')}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_surname">Digite sua família/sobrenome(s) conforme mostrado em seu passaporte. <Required/></Label>
                      <Input type="text" id="user_surname" className="md:w-1/2" required {...register('surname')}/>
                    </div>
                    <p className="text-sm text-yellow-600"><WarningDiamond className="size-4 inline"/> Certifique-se de ter incluído TODOS os nomes constantes em seu passaporte, incluindo nomes do meio.<br />O preenchimento incorreto pode ocasionar a recusa da sua NZeTA.</p>
                    <div className="space-y-2">
                      <Label>Você já foi conhecido por um nome diferente? <Required/></Label>
                      <div className="mt-2">
                        <RadioGroup className="flex flex-row gap-5" required {...register('hadOtherName')} onChange={(e: any) => handleRadioChange(e.target.value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="true"
                              id="had-other-name-option-yes"
                            />
                            <Label htmlFor="had-other-name-option-yes">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="false"
                              id="had-other-name-option-no"
                            />
                            <Label htmlFor="had-other-name-option-no">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    {otherName && ( 
                      <div className="space-y-2">
                        <Label htmlFor="user_othername">Insira seu outro nome completo. <Required/></Label>
                        <Input type="text" id="user_othername" className="md:w-1/2" required {...register('otherName')} />
                      </div>
                    )} 
                    <div className="space-y-2">
                      <Label>Selecione seu gênero conforme consta em seu passaporte. <Required/></Label>
                      <RadioGroup required {...register('gender')} onChange={(e: any) => handleRadioGender(e.target.value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Masculino" id="user_gender-m" />
                          <Label htmlFor="user_gender-m">Masculino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Feminino" id="user_gender-f" />
                          <Label htmlFor="user_gender-f">Feminino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Gênero diverso" id="user_gender-d" />
                          <Label htmlFor="user_gender-d">Gênero diverso</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_date-birth">Selecione sua data de nascimento conforme mostrado em seu passaporte. <Required/></Label>
                      <Input type="date" id="user_date-birth" className="md:w-1/2" required {...register('dateBirth')}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_place-birth">Digite seu local de nascimento. <Required/></Label>
                      <Input type="text" id="user_place-birth" className="md:w-1/2" required {...register('cityBirth')}/>
                    </div>
                    <div className="space-y-2">
                      <Label>Selecione seu país ou território de nascimento.  <Required/></Label>
                      <Select
                        options={countries}
                        defaultValue={{ label: "Brasil", value: "Brasil" }}
                        className="md:w-1/2"
                        onChange={handleCountryBirthChange}
                        isSearchable
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_contact-email">
                        Insira um e-mail válido. <Required/>
                        <Tip content="As informações sobre a sua solicitação NZeTA serão enviadas para este endereço." />  
                      </Label>
                      <Input
                        type="email"
                        id="user_contact-email"
                        className="md:w-1/2"
                        required
                        value={firstEmail}
                        onChange={handleFirstEmailChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_contact-email-second">Confirme seu e-mail. <Required/></Label>
                      <Input
                        type="email"
                        id="user_contact-email-second"
                        className="md:w-1/2"
                        value={secondEmail}
                        onChange={handleSecondEmailChange}
                        autoComplete="off"
                        onPaste={(e) => e.preventDefault()}
                        required
                      />
                      {errors['comparing-emails'] && <p className="text-red-500">{errors['comparing-emails']}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_contact-telephone">Número de celular <Required/></Label>
                      <Input
                        type="text"
                        id="user_contact-telephone"
                        className="md:w-1/2"
                        required
                        {...register('telephone')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_national-document">Insira seu CPF <Required/></Label>
                      <Input type="text" id="user_national-document" className="md:w-1/2" {...register('nationalDocument')}/>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Você é residente permanente na Austrália e tem um visto que permite retornar à Austrália? <Required/>
                        <Tip content='Selecione "Sim" se você tiver um visto de residente permanente australiano válido ou um visto de retorno de residente australiano e as condições de viagem do visto que permitem retornar à Austrália. Caso contrário, selecione "Não".' />
                      </Label>
                      <div className="mt-2">
                        <RadioGroup
                          className="flex flex-row gap-5"
                          required
                          {...register('returnToAustralia')}
                          onChange={(e: any) => handleRadioReturnToAustralia(e.target.value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="returnToAustralia-one" />
                            <Label htmlFor="returnToAustralia-one">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="returnToAustralia-two" />
                            <Label htmlFor="returnToAustralia-two">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {/* Exibir aviso de trânsito */}
                      {returnToAustralia === 'true' && (stayInNZ === 'false' || stayInNZ == null) && (
                        <p className="text-sm text-yellow-600 md:w-1/2">
                          <WarningDiamond className="size-4 inline" /> Aviso: Se você escolher esta opção, seu NZeTA será válido apenas para trânsito. Se você planeja sair do aeroporto e entrar na Nova Zelândia, deverá indicar isso agora em sua solicitação NZeTA.<br />Para alterar sua resposta, selecione &apos;Não&apos;.
                        </p>
                      )}
                    </div>
                    { returnToAustralia === 'false' && (
                      <div className="space-y-2">
                        <Label>
                          Você vai permanecer na Nova Zelândia ou é apenas trânsito? <Required />
                        </Label>
                        <div className="mt-2">
                          <RadioGroup
                            className="flex flex-row gap-5"
                            required
                            {...register('stayInNZ')}
                            onChange={(e: any) => setStayInNZ(e.target.value)}
                          >
                            <div className="flex items-center space-x-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <RadioGroupItem value="true" id="stay-nz-yes" />
                                </AlertDialogTrigger>
                                <AlertDialogContent className="mx-auto w-11/12 rounded-lg md:w-full">
                                  <AlertDialogHeader>
                                    <p className="font-bold text-xl text-red-500">ATENÇÃO!</p>
                                    <AlertDialogTitle>O que é a IVL e quanto custa?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    Caso sua viagem não seja somente de trânsito e você permaneça na Nova Zelândia, precisará pagar também a Taxa Internacional de Turismo e Conservação da Nova Zelândia (IVL). A IVL corresponde a 100 dólares neozelandeses, ou R$ 350,00.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className={buttonVariants({variant: "default"}) + ` hover:text-gray-200`}>
                                        Compreendo
                                    </AlertDialogCancel>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <Label htmlFor="stay-nz-yes">Sim, vou permanecer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="stay-nz-no" />
                              <Label htmlFor="stay-nz-no">Não, apenas trânsito</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        { stayInNZ === 'false' && (
                          <p className="text-sm text-yellow-600 md:w-1/2">
                            Se você escolher esta opção, seu NZeTA será válido apenas para trânsito. Se você planeja sair do aeroporto e entrar na Nova Zelândia, você deve indicar isso em sua solicitação de NZeTA e pagar o International Visitor Conservation and Tourism Levy (IVL). Para alterar sua resposta, selecione &quot;Sim, vou permanecer&quot;.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {returnToAustralia !== null && (
                  <Card id="eligibility">
                    <CardHeader>
                      <h3 className="text-lg font-bold">Perguntas de elegibilidade</h3>
                    </CardHeader>
                    <hr />
                    <CardContent className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Você viajará para a Nova Zelândia para consulta ou tratamento médico? <Required/></Label>
                        <div className="mt-2">
                          <RadioGroup className="flex flex-row gap-5" required {...register('medicalTreatment')}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="1" id="medicalTreatment-one" />
                              <Label htmlFor="medicalTreatment-one">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="0" id="medicalTreatment-two" />
                              <Label htmlFor="medicalTreatment-two">Não</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Você já foi deportado, removido ou excluído de outro país (não da Nova Zelândia)? <Required/></Label>
                        <div className="mt-2">
                          <RadioGroup className="flex flex-row gap-5" required {...register('beenDeported')} onChange={(e: any) => handleRadioBeenDeported(e.target.value)}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="1" id="beenDeported-one" />
                              <Label htmlFor="beenDeported-one">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="0" id="beenDeported-two" />
                              <Label htmlFor="beenDeported-two">Não</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Você está atualmente proibido de entrar na Nova Zelândia após ter sido deportado da Nova Zelândia no passado? <Required/></Label>
                        <div className="mt-2">
                          <RadioGroup className="flex flex-row gap-5" required {...register('forbiddenEnter')} onChange={(e: any) => handleRadioForbiddenEnter(e.target.value)}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id="forbiddenEnter-one" />
                              <Label htmlFor="forbiddenEnter-one">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="forbiddenEnter-two" />
                              <Label htmlFor="forbiddenEnter-two">Não</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        {forbiddenEnter && 
                          <p className="text-sm text-red-500">
                            <WarningDiamond className="size-4 inline"/> Aviso: Com base nas suas informações, você não é elegível para uma NZeTA. Solicite um visto de visitante.
                          </p>
                        }
                      </div>
                      <div className="space-y-2">
                        <Label>Você já foi condenado por algum crime (em algum país)? <Required/></Label>
                        <div className="mt-2">
                          <RadioGroup className="flex flex-row gap-5" required {...register('beenConvicted')} onChange={(e: any) => handleRadioBeenConvicted(e.target.value)}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id="beenConvicted-one" />
                              <Label htmlFor="beenConvicted-one">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="beenConvicted-two" />
                              <Label htmlFor="beenConvicted-two">Não</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      { beenConvicted && (
                          <div className="space-y-2">
                            <Label>Você já foi condenado por um crime pelo qual foi sentenciado a cinco anos ou mais de prisão? <Required/></Label>
                            <div>
                              <RadioGroup className="flex flex-row gap-5" required {...register('convictedMoreThanFive')} onChange={(e: any) => handleRadioConvictedMoreThanFive(e.target.value)}>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="true" id="convictedMoreThanFive-one" />
                                  <Label htmlFor="convictedMoreThanFive-one">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="false" id="convictedMoreThanFive-two" />
                                  <Label htmlFor="convictedMoreThanFive-two">Não</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            { convictedMoreThanFive  ? 
                                <p className="text-sm text-red-500">
                                  <WarningDiamond className="size-4 inline"/> Aviso: Com base nas suas informações, você não é elegível para uma NZeTA. Solicite um visto de visitante.
                                </p>
                              :
                              <div className="space-y-2">
                                <Label>Nos últimos 10 anos foi condenado por um crime pelo qual foi condenado a uma pena de prisão igual ou superior a 12 meses? <Required/></Label>
                                <div>
                                  <RadioGroup className="flex flex-row gap-5" required {...register('convictedMoreThanTwelve')} onChange={(e: any) => handleRadioConvictedMoreThanTwelve(e.target.value)}>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="true" id="convictedMoreThanTwelve-one" />
                                      <Label htmlFor="convictedMoreThanTwelve-one">Sim</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="false" id="convictedMoreThanTwelve-two" />
                                      <Label htmlFor="convictedMoreThanTwelve-two">Não</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                                { convictedMoreThanTwelve && 
                                  <p className="text-sm text-red-500">
                                    <WarningDiamond className="size-4 inline"/> Aviso: Com base nas suas informações, você não é elegível para uma NZeTA. Solicite um visto de visitante.
                                  </p>
                                }
                              </div>
                            }
                          </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Button className="text-center mx-auto"  disabled={formState.isSubmitting || firstEmail !== secondEmail || forbiddenEnter || convictedMoreThanFive || convictedMoreThanTwelve }>
                  {formState.isSubmitting ? "Salvando formulário..." : "Forneça a sua foto"}
                </Button>
              </>
            }
            
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Tip({content}: {content: string}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger><Badge className="bg-green-200 text-green-700 hover:bg-green-300">?</Badge></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>AJUDA</AlertDialogTitle>
          <AlertDialogDescription>
            {content}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function Required() {
  return (
    <span className="text-red-500 bold text-xl">* </span>
  )
}

const countries = [
  {label: "Afeganistão", value: "Afeganistão"},
  {label: "África do Sul", value: "África do Sul"},
  {label: "Albânia", value: "Albânia"},
  {label: "Alemanha", value: "Alemanha"},
  {label: "Andorra", value: "Andorra"},
  {label: "Angola", value: "Angola"},
  {label: "Anguilla", value: "Anguilla"},
  {label: "Antártica", value: "Antártica"},
  {label: "Antígua e Barbuda", value: "Antígua e Barbuda"},
  {label: "Arábia Saudita", value: "Arábia Saudita"},
  {label: "Argélia", value: "Argélia"},
  {label: "Argentina", value: "Argentina"},
  {label: "Armênia", value: "Armênia"},
  {label: "Aruba", value: "Aruba"},
  {label: "Austrália", value: "Austrália"},
  {label: "Áustria", value: "Áustria"},
  {label: "Azerbaijão", value: "Azerbaijão"},
  {label: "Bahamas", value: "Bahamas"},
  {label: "Bangladesh", value: "Bangladesh"},
  {label: "Barbados", value: "Barbados"},
  {label: "Barein", value: "Barein"},
  {label: "Bélgica", value: "Bélgica"},
  {label: "Belize", value: "Belize"},
  {label: "Benin", value: "Benin"},
  {label: "Bermudas", value: "Bermudas"},
  {label: "Bolívia", value: "Bolívia"},
  {label: "Bonaire, Sint Eustatius e Saba", value: "Bonaire, Sint Eustatius e Saba"},
  {label: "Bósnia e Herzegovina", value: "Bósnia e Herzegovina"},
  {label: "Botsuana", value: "Botsuana"},
  {label: "Brasil", value: "Brasil"},
  {label: "Brunei Darussalam", value: "Brunei Darussalam"},
  {label: "Bulgária", value: "Bulgária"},
  {label: "Burquina Faso", value: "Burquina Faso"},
  {label: "Burundi", value: "Burundi"},
  {label: "Butão", value: "Butão"},
  {label: "Cabo Verde", value: "Cabo Verde"},
  {label: "Camarões", value: "Camarões"},
  {label: "Camboja", value: "Camboja"},
  {label: "Canadá", value: "Canadá"},
  {label: "Catar", value: "Catar"},
  {label: "Cazaquistão", value: "Cazaquistão"},
  {label: "Chade", value: "Chade"},
  {label: "Chile", value: "Chile"},
  {label: "China", value: "China"},
  {label: "Chipre", value: "Chipre"},
  {label: "Cingapura", value: "Cingapura"},
  {label: "Colômbia", value: "Colômbia"},
  {label: "Comores", value: "Comores"},
  {label: "Congo", value: "Congo"},
  {label: "Coreia do Norte", value: "Coreia do Norte"},
  {label: "Coreia do Sul", value: "Coreia do Sul"},
  {label: "Costa do Marfim", value: "Costa do Marfim"},
  {label: "Costa Rica", value: "Costa Rica"},
  {label: "Croácia", value: "Croácia"},
  {label: "Cuba", value: "Cuba"},
  {label: "Curaçao", value: "Curaçao"},
  {label: "Dinamarca", value: "Dinamarca"},
  {label: "Djibuti", value: "Djibuti"},
  {label: "Dominica", value: "Dominica"},
  {label: "Egito", value: "Egito"},
  {label: "El Salvador", value: "El Salvador"},
  {label: "Emirados Árabes Unidos", value: "Emirados Árabes Unidos"},
  {label: "Equador", value: "Equador"},
  {label: "Eritreia", value: "Eritreia"},
  {label: "Eslováquia", value: "Eslováquia"},
  {label: "Eslovênia", value: "Eslovênia"},
  {label: "Espanha", value: "Espanha"},
  {label: "Estados Unidos da América", value: "Estados Unidos da América"},
  {label: "Estônia", value: "Estônia"},
  {label: "Eswatini", value: "Eswatini"},
  {label: "Etiópia", value: "Etiópia"},
  {label: "Falkland [Malvinas]", value: "Falkland [Malvinas]"},
  {label: "Fiji", value: "Fiji"},
  {label: "Filipinas", value: "Filipinas"},
  {label: "Finlândia", value: "Finlândia"},
  {label: "França", value: "França"},
  {label: "Gabão", value: "Gabão"},
  {label: "Gâmbia", value: "Gâmbia"},
  {label: "Gana", value: "Gana"},
  {label: "Geórgia", value: "Geórgia"},
  {label: "Gibraltar", value: "Gibraltar"},
  {label: "Granada", value: "Granada"},
  {label: "Grécia", value: "Grécia"},
  {label: "Groenlândia", value: "Groenlândia"},
  {label: "Guadalupe", value: "Guadalupe"},
  {label: "Guam", value: "Guam"},
  {label: "Guatemala", value: "Guatemala"},
  {label: "Guernsey", value: "Guernsey"},
  {label: "Guiana", value: "Guiana"},
  {label: "Guiné", value: "Guiné"},
  {label: "Guiné-Bissau", value: "Guiné-Bissau"},
  {label: "Haiti", value: "Haiti"},
  {label: "Holanda", value: "Holanda"},
  {label: "Honduras", value: "Honduras"},
  {label: "Hong Kong", value: "Hong Kong"},
  {label: "Hungria", value: "Hungria"},
  {label: "Iêmen", value: "Iêmen"},
  {label: "Ilha Bouvet", value: "Ilha Bouvet"},
  {label: "Ilha Christmas", value: "Ilha Christmas"},
  {label: "Ilha de Man", value: "Ilha de Man"},
  {label: "Ilha Norfolk", value: "Ilha Norfolk"},
  {label: "Ilhas Aland", value: "Ilhas Aland"},
  {label: "Ilhas Cayman", value: "Ilhas Cayman"},
  {label: "Ilhas Cocos", value: "Ilhas Cocos"},
  {label: "Ilhas Cook", value: "Ilhas Cook"},
  {label: "Ilhas Feroe", value: "Ilhas Feroe"},
  {label: "Ilhas Geórgia do Sul e Sandwich do Sul", value: "Ilhas Geórgia do Sul e Sandwich do Sul"},
  {label: "Ilhas Heard e McDonald", value: "Ilhas Heard e McDonald"},
  {label: "Ilhas Malvinas", value: "Ilhas Malvinas"},
  {label: "Ilhas Marshall", value: "Ilhas Marshall"},
  {label: "Ilhas Pitcairn", value: "Ilhas Pitcairn"},
  {label: "Ilhas Salomão", value: "Ilhas Salomão"},
  {label: "Ilhas Turcas e Caicos", value: "Ilhas Turcas e Caicos"},
  {label: "Ilhas Virgens Britânicas", value: "Ilhas Virgens Britânicas"},
  {label: "Ilhas Virgens dos Estados Unidos", value: "Ilhas Virgens dos Estados Unidos"},
  {label: "Índia", value: "Índia"},
  {label: "Indonésia", value: "Indonésia"},
  {label: "Irã", value: "Irã"},
  {label: "Iraque", value: "Iraque"},
  {label: "Irlanda", value: "Irlanda"},
  {label: "Islândia", value: "Islândia"},
  {label: "Israel", value: "Israel"},
  {label: "Itália", value: "Itália"},
  {label: "Jamaica", value: "Jamaica"},
  {label: "Japão", value: "Japão"},
  {label: "Jersey", value: "Jersey"},
  {label: "Jordânia", value: "Jordânia"},
  {label: "Kosovo", value: "Kosovo"},
  {label: "Kuwait", value: "Kuwait"},
  {label: "Laos", value: "Laos"},
  {label: "Lesoto", value: "Lesoto"},
  {label: "Letônia", value: "Letônia"},
  {label: "Líbano", value: "Líbano"},
  {label: "Libéria", value: "Libéria"},
  {label: "Líbia", value: "Líbia"},
  {label: "Liechtenstein", value: "Liechtenstein"},
  {label: "Lituânia", value: "Lituânia"},
  {label: "Luxemburgo", value: "Luxemburgo"},
  {label: "Macau", value: "Macau"},
  {label: "Macedônia do Norte", value: "Macedônia do Norte"},
  {label: "Madagáscar", value: "Madagáscar"},
  {label: "Malásia", value: "Malásia"},
  {label: "Malawi", value: "Malawi"},
  {label: "Maldivas", value: "Maldivas"},
  {label: "Mali", value: "Mali"},
  {label: "Malta", value: "Malta"},
  {label: "Marrocos", value: "Marrocos"},
  {label: "Martinica", value: "Martinica"},
  {label: "Maurício", value: "Maurício"},
  {label: "Mauritânia", value: "Mauritânia"},
  {label: "Mayotte", value: "Mayotte"},
  {label: "México", value: "México"},
  {label: "Micronésia", value: "Micronésia"},
  {label: "Moçambique", value: "Moçambique"},
  {label: "Moldávia", value: "Moldávia"},
  {label: "Mônaco", value: "Mônaco"},
  {label: "Mongólia", value: "Mongólia"},
  {label: "Montenegro", value: "Montenegro"},
  {label: "Montserrat", value: "Montserrat"},
  {label: "Myanmar", value: "Myanmar"},
  {label: "Namíbia", value: "Namíbia"},
  {label: "Nauru", value: "Nauru"},
  {label: "Nepal", value: "Nepal"},
  {label: "Nicarágua", value: "Nicarágua"},
  {label: "Níger", value: "Níger"},
  {label: "Nigéria", value: "Nigéria"},
  {label: "Niue", value: "Niue"},
  {label: "Noruega", value: "Noruega"},
  {label: "Nova Caledônia", value: "Nova Caledônia"},
  {label: "Nova Zelândia", value: "Nova Zelândia"},
  {label: "Omã", value: "Omã"},
  {label: "Palau", value: "Palau"},
  {label: "Palestina", value: "Palestina"},
  {label: "Panamá", value: "Panamá"},
  {label: "Papua Nova Guiné", value: "Papua Nova Guiné"},
  {label: "Paquistão", value: "Paquistão"},
  {label: "Paraguai", value: "Paraguai"},
  {label: "Peru", value: "Peru"},
  {label: "Polônia", value: "Polônia"},
  {label: "Porto Rico", value: "Porto Rico"},
  {label: "Portugal", value: "Portugal"},
  {label: "Quênia", value: "Quênia"},
  {label: "Quirguistão", value: "Quirguistão"},
  {label: "Reino Unido", value: "Reino Unido"},
  {label: "República Centro-Africana", value: "República Centro-Africana"},
  {label: "República Democrática do Congo", value: "República Democrática do Congo"},
  {label: "República Dominicana", value: "República Dominicana"},
  {label: "Romênia", value: "Romênia"},
  {label: "Ruanda", value: "Ruanda"},
  {label: "Rússia", value: "Rússia"},
  {label: "Saara Ocidental", value: "Saara Ocidental"},
  {label: "Saint Barthelemy", value: "Saint Barthelemy"},
  {label: "Saint Kitts e Nevis", value: "Saint Kitts e Nevis"},
  {label: "Saint Lucia", value: "Saint Lucia"},
  {label: "Saint Martin", value: "Saint Martin"},
  {label: "Saint Pierre e Miquelon", value: "Saint Pierre e Miquelon"},
  {label: "Saint Vincent e Granadinas", value: "Saint Vincent e Granadinas"},
  {label: "Samoa", value: "Samoa"},
  {label: "San Marino", value: "San Marino"},
  {label: "Santa Helena, Ascensão e Tristão da Cunha", value: "Santa Helena, Ascensão e Tristão da Cunha"},
  {label: "Santa Lúcia", value: "Santa Lúcia"},
  {label: "São Tomé e Príncipe", value: "São Tomé e Príncipe"},
  {label: "Senegal", value: "Senegal"},
  {label: "Serra Leoa", value: "Serra Leoa"},
  {label: "Sérvia", value: "Sérvia"},
  {label: "Seychelles", value: "Seychelles"},
  {label: "Singapura", value: "Singapura"},
  {label: "Somália", value: "Somália"},
  {label: "Sri Lanka", value: "Sri Lanka"},
  {label: "Sudão", value: "Sudão"},
  {label: "Sudão do Sul", value: "Sudão do Sul"},
  {label: "Suécia", value: "Suécia"},
  {label: "Suíça", value: "Suíça"},
  {label: "Suriname", value: "Suriname"},
  {label: "Síria", value: "Síria"},
  {label: "Tadjiquistão", value: "Tadjiquistão"},
  {label: "Tailândia", value: "Tailândia"},
  {label: "Taiwan", value: "Taiwan"},
  {label: "Tanzânia", value: "Tanzânia"},
  {label: "Timor-Leste", value: "Timor-Leste"},
  {label: "Togo", value: "Togo"},
  {label: "Tokelau", value: "Tokelau"},
  {label: "Tonga", value: "Tonga"},
  {label: "Trinidad e Tobago", value: "Trinidad e Tobago"},
  {label: "Tunísia", value: "Tunísia"},
  {label: "Turcomenistão", value: "Turcomenistão"},
  {label: "Turquia", value: "Turquia"},
  {label: "Tuvalu", value: "Tuvalu"},
  {label: "Ucrânia", value: "Ucrânia"},
  {label: "Uganda", value: "Uganda"},
  {label: "Uruguai", value: "Uruguai"},
  {label: "Uzbequistão", value: "Uzbequistão"},
  {label: "Vanuatu", value: "Vanuatu"},
  {label: "Vaticano", value: "Vaticano"},
  {label: "Venezuela", value: "Venezuela"},
  {label: "Vietnã", value: "Vietnã"},
  {label: "Wallis e Futuna", value: "Wallis e Futuna"},
  {label: "Zâmbia", value: "Zâmbia"},
  {label: "Zimbábue", value: "Zimbábue"}
]