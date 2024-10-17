'use client'

import { useRouter } from "next/navigation"
import { getUniqueVisa } from "./action"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

import { FormEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
const Select = dynamic(() => import('react-select'), { ssr: false })

import { Plus, WarningDiamond, X } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { set } from "date-fns"

type VisaData = {
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
  nationalDocument: string
  returnToAustralia: boolean
  stayInNZ: boolean
  medicalTreatment: boolean
  beenDeported: boolean
  forbiddenEnter: boolean
  beenConvicted: boolean
  convictedMoreThanFive: boolean
  convictedMoreThanTwelve: boolean
  imagePath: string
}

export default function Confirm () {
  const router = useRouter()
  const { register, handleSubmit, reset, setValue, formState } = useForm()
  
  const [initialData, setInitialData] = useState<VisaData | null>(null)
  const [imagePath, setImagePath] = useState<string>()
  const [selectedNationality, setSelectedNationality] = useState<{ value: string; label: string }>()
  const [selectedIssuer, setSelectedIssuer] = useState<{ value: string; label: string }>()
  const [selectedCountryBirth, setSelectedCountryBirth] = useState<{ value: string; label: string }>()
  
  const [agreement, setAgreement] = useState(false)
  const [term, setTerm] = useState(false)
  const isButtonDisabled = !(agreement && term)

  const [modal, setModal] = useState(false)
  
  const [visaId, setVisaId] = useState<string | null>(null)

  // Verifica se o localStorage está disponível e recupera o visaId
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVisaId = localStorage.getItem("visaId")
      setVisaId(storedVisaId)
    }
  }, [])

  useEffect(() => {
    if (!visaId) return

    const fetchData = async () => {
      try {
        const visa: any = await getUniqueVisa(visaId)
        if (visa) {
          setInitialData(visa)
          setImagePath(visa.imagePath)
          setSelectedNationality({ value: visa.passportNationality, label: visa.passportNationality })
          setSelectedIssuer({ value: visa.passportIssuer, label: visa.passportIssuer })
          setSelectedCountryBirth({ value: visa.countryBirth, label: visa.countryBirth })

          const formattedExpiryDate = new Date(visa.passportExpiration).toISOString().split('T')[0]
          setValue('passportExpiryDate', formattedExpiryDate)

          const formattedUserBirth = new Date(visa.dateBirth).toISOString().split('T')[0]
          setValue('dateUserBirth', formattedUserBirth)
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [visaId, setValue])

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset, setValue])

  const handleNationalityChange = (selectedOption: any) => setValue('passportNationality', selectedOption.value)
  const handleIssuerChange = (selectedOption: any) => setValue('passportIssuer', selectedOption.value)
  const handleCountryBirthChange = (selectedOption: any) => setValue('countryBirth', selectedOption.value)

  const handleModal = (state: boolean) => { setModal(state) }

  const onSubmit = async (e: FormEvent, action: string) => {
    e.preventDefault()

    try {
      if (typeof window !== "undefined") {
        const visasInSession = localStorage.getItem('visasInSession')
        if (!visasInSession) {
          const visas = JSON.stringify([visaId])
          localStorage.setItem('visasInSession', visas)
        } else {
          const objVisas = JSON.parse(visasInSession)
          objVisas.push(visaId)
          const stringVisas = JSON.stringify(objVisas)

          localStorage.setItem('visasInSession', stringVisas)
        }
        localStorage.removeItem('visaId')

        switch(action) {
          case "addAnother":
            router.push('/aplicacao/dados')
            break
          case "goToPayment":
            router.push('/aplicacao/checkout')
            break
        }
      }
    } catch (e) {
      console.log(e)
      toast({
        variant: "destructive",
        title: 'Erro',
        description: 'Um erro ocorreu ao prosseguir para o próximo passo'
      })
    } finally {
      router.refresh()
    }
  }

  return (
    <>
      <Header />
      <main className="container mx-auto my-16">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Solicitação de Autorização Eletrônica de Viagem (NZeTA)</h1>
          <hr />
          <h2 className="text-2xl font-bold">Progresso da sua aplicação</h2>
          <Progress value={75}/>
        </div>
        <div>
          <form className="flex flex-col items-stretch">
            <div className="space-y-8">
              <Card id="photo">
                <CardHeader>
                  <h3 className="text-lg font-bold">Sua foto</h3>
                </CardHeader>
                <hr />
                <CardContent className="py-4">
                  <Image
                    src={initialData?.imagePath as string}
                    width={300}
                    height={300}
                    alt={initialData?.name as string}
                    className="aspect-[3/4] object-cover rounded-md max-w-full max-h-full"
                  />
                </CardContent>
              </Card>

              <Card id="passport">
                <CardHeader>
                  <h3 className="text-lg font-bold">Detalhes do passaporte</h3>
                </CardHeader>
                <hr />
                <CardContent className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="passport_nationality">Selecione sua nacionalidade conforme mostrado no passaporte em que você viajará.</Label>
                    <Select
                      options={countries}
                      value={selectedNationality}
                      onChange={handleNationalityChange}
                      className="md:w-1/2"
                      isSearchable
                      isDisabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="passport_issuing-country">Selecione o país ou território emissor conforme mostrado no seu passaporte.</Label>
                    <Select
                      options={countries}
                      value={selectedIssuer}
                      onChange={handleIssuerChange}
                      className="md:w-1/2"
                      isSearchable
                      isDisabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="passport_number">Digite o número do seu passaporte exatamente como aparece no seu passaporte.</Label>
                    <Input type="text" id="passport_number" className="md:w-1/2" {...register('passportNumber')} disabled />
                  </div>
                  <div>
                    <Label htmlFor="passport_expiration">Selecione a data de validade conforme mostrada no seu passaporte</Label>
                    <Input type="date" id="passport_expiration" className="md:w-1/2" {...register('passportExpiryDate')} disabled/>
                  </div>
                </CardContent>
              </Card>

              <Card id="traveller">
                <CardHeader>
                  <h3 className="text-lg font-bold">Detalhes do passageiro</h3>
                </CardHeader>
                <hr />
                <CardContent className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="user_name">Digite seu(s) nome(s) incluindo seu(s) nome(s) do meio conforme mostrado em seu passaporte.</Label>
                    <Input type="text" id="user_name" className="md:w-1/2" {...register('name')} disabled/>
                  </div>
                  <div>
                    <Label htmlFor="user_surname">Digite sua família/sobrenome(s) conforme mostrado em seu passaporte.</Label>
                    <Input type="text" id="user_surname" className="md:w-1/2" {...register('surname')} disabled/>
                  </div>
                  <p className="text-sm text-yellow-600"><WarningDiamond className="size-4 inline"/> Certifique-se de ter incluído TODOS os nomes constantes em seu passaporte, incluindo nomes do meio.<br />O preenchimento incorreto pode ocasionar a recusa da sua NZeTA.</p>
                  <div>
                    <Label>Você já foi conhecido por um nome diferente?</Label>
                    <div className="mt-2">
                      <RadioGroup
                        className="flex flex-row gap-5"
                        {...register('hadOtherName')}
                        disabled
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="true"
                            id="had-other-name-option-yes"
                            checked={initialData?.hadOtherName}
                          />
                          <Label htmlFor="had-other-name-option-yes">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="false"
                            id="had-other-name-option-no"
                            checked={!initialData?.hadOtherName}
                          />
                          <Label htmlFor="had-other-name-option-no">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  {initialData?.hadOtherName && initialData?.otherName && (
                    <div>
                      <Label htmlFor="user_othername">Insira seu outro nome completo</Label>
                      <Input type="text" id="user_othername" className="md:w-1/2" {...register('otherName')} disabled/>
                    </div>
                  )}
                  <div>
                    <Label>Selecione seu gênero conforme consta em seu passaporte.</Label>
                    <div className="mt-2">
                      <RadioGroup {...register('gender')} disabled>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Masculino" id="user_gender-m" checked={initialData?.gender === "Masculino"} />
                          <Label htmlFor="user_gender-m">Masculino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Feminino" id="user_gender-f" checked={initialData?.gender === "Feminino"} />
                          <Label htmlFor="user_gender-f">Feminino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Gênero diverso" id="user_gender-d" checked={initialData?.gender === "Gênero diverso"} />
                          <Label htmlFor="user_gender-d">Gênero diverso</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="user_date-birth">Selecione sua data de nascimento conforme consta no seu passaporte</Label>
                    <Input type="date" id="user_date-birth" className="md:w-1/2" {...register('dateUserBirth')} disabled/>
                  </div>
                  <div>
                    <Label htmlFor="user_place-birth">Insira sua cidade de nascimento</Label>
                    <Input type="text" id="user_place-birth" className="md:w-1/2" {...register('cityBirth')} disabled/>
                  </div>
                  <div>
                    <Label htmlFor="user_country-birth">Selecione seu país ou território de nascimento</Label>
                    <Select
                      options={countries}
                      value={selectedCountryBirth}
                      onChange={handleCountryBirthChange}
                      className="md:w-1/2"
                      isSearchable
                      isDisabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="user_contact-email">Insira um e-mail válido</Label>
                    <Input
                      type="email"
                      id="user_contact-email"
                      className="md:w-1/2"
                      {...register('email')}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="user_contact-email-second">Confirme seu e-mail</Label>
                    <Input
                      type="email"
                      id="user_contact-email-second"
                      className="md:w-1/2"
                      value={initialData?.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="user_contact-telephone">Número de celular</Label>
                      <Input
                        type="text"
                        id="user_contact-telephone"
                        className="md:w-1/2"
                        required
                        disabled
                        {...register('telephone')}
                      />
                    </div>
                  <div>
                    <Label htmlFor="user_national-document">Insira seu CPF</Label>
                    <Input type="text" id="user_national-document" className="md:w-1/2" {...register('nationalDocument')} disabled/>
                  </div>
                  <div className="space-y-2">
                    <Label>Você é residente permanente na Austrália e tem um visto que permite retornar à Austrália?</Label>
                    <div className="mt-2">
                      <RadioGroup
                        className="flex flex-row gap-5"
                        {...register('returnToAustralia')}
                        disabled
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="true"
                            id="option-one"
                            checked={initialData?.returnToAustralia}
                          />
                          <Label htmlFor="option-one">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="false"
                            id="option-two"
                            checked={!initialData?.returnToAustralia}
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
                        {...register('stayInNZ')}
                        disabled
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="true"
                            id="stay-nz-yes"
                            checked={initialData?.stayInNZ}
                          />
                          <Label htmlFor="stay-nz-yes">Sim, vou permanecer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="false"
                            id="stay-nz-no"
                            checked={!initialData?.stayInNZ}
                          />
                          <Label htmlFor="stay-nz-no">Não, apenas trânsito</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card id="eligibility">
                <CardHeader>
                  <h3 className="text-lg font-bold">Perguntas de elegibilidade</h3>
                </CardHeader>
                <hr />
                <CardContent className="space-y-4 py-4">
                  <div>
                    <Label>Você viajará para a Nova Zelândia para consulta ou tratamento médico?</Label>
                    <div className="mt-2">
                      <RadioGroup className="flex flex-row gap-5" {...register('medicalTreatment')} disabled>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="1"
                            id="option-one"
                            checked={initialData?.medicalTreatment}
                          />
                          <Label htmlFor="option-one">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="0"
                            id="option-two"
                            checked={!initialData?.medicalTreatment}
                          />
                          <Label htmlFor="option-two">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div>
                    <Label>Você já foi deportado, removido ou excluído de outro país (não da Nova Zelândia)?</Label>
                    <div className="mt-2">
                      <RadioGroup className="flex flex-row gap-5" {...register('beenDeported')} disabled>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="1"
                            id="option-one"
                            checked={initialData?.beenDeported}
                          />
                          <Label htmlFor="option-one">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="0"
                            id="option-two"
                            checked={!initialData?.beenDeported}
                          />
                          <Label htmlFor="option-two">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div>
                    <Label>Você está atualmente proibido de entrar na Nova Zelândia após ter sido deportado da Nova Zelândia no passado?</Label>
                    <div className="mt-2">
                      <RadioGroup className="flex flex-row gap-5" {...register('forbiddenEnter')} disabled>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="1"
                            id="option-one"
                            checked={initialData?.forbiddenEnter}
                          />
                          <Label htmlFor="option-one">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="0"
                            id="option-two"
                            checked={!initialData?.forbiddenEnter}
                          />
                          <Label htmlFor="option-two">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div>
                    <Label>Você já foi condenado por algum crime (em algum país)?</Label>
                    <div className="mt-2">
                      <RadioGroup className="flex flex-row gap-5" {...register('beenConvicted')} disabled>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="1"
                            id="option-one"
                            checked={initialData?.beenConvicted}
                          />
                          <Label htmlFor="option-one">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="0"
                            id="option-two"
                            checked={!initialData?.beenConvicted}
                          />
                          <Label htmlFor="option-two">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  { initialData?.beenConvicted && (
                    <div className="space-y-2">
                      <Label>Você já foi condenado por um crime pelo qual foi sentenciado a cinco anos ou mais de prisão? </Label>
                      <div>
                        <RadioGroup className="flex flex-row gap-5" required {...register('convictedMoreThanFive')} disabled>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="true"
                              id="option-one"
                              checked={initialData.convictedMoreThanFive}
                            />
                            <Label htmlFor="option-one">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="false"
                              id="option-two"
                              checked={!initialData.convictedMoreThanFive}
                            />
                            <Label htmlFor="option-two">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      { !initialData.convictedMoreThanFive &&
                        <div className="space-y-2">
                          <Label>Nos últimos 10 anos foi condenado por um crime pelo qual foi condenado a uma pena de prisão igual ou superior a 12 meses?</Label>
                          <div>
                            <RadioGroup className="flex flex-row gap-5" required {...register('convictedMoreThanTwelve')} disabled>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="true"
                                  id="option-one"
                                  checked={initialData.convictedMoreThanTwelve}
                                />
                                <Label htmlFor="option-one">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="false"
                                  id="option-two"
                                  checked={!initialData.convictedMoreThanTwelve}
                                />
                                <Label htmlFor="option-two">Não</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      }
                    </div>
                )}
                </CardContent>
              </Card>

              <Card id="terms">
                <CardHeader>
                  <h3 className="text-lg font-bold">Aceite de Termos e Políticas</h3>
                </CardHeader>
                <hr />
                <CardContent className="space-y-2 py-4">
                  <h4 className="font-bold">Solicitação NZeTA</h4>
                  <p>Certifique-se de ter verificado suas informações cuidadosamente. Você pode voltar e alterar suas informações a qualquer momento antes de enviar sua solicitação NZeTA. A taxa de solicitação NZeTA e o pagamento IVL não são reembolsáveis.</p>
                  <p>A Immigration New Zealand (INZ) usará as informações que você forneceu neste formulário para avaliar sua solicitação de NZeTA. Suas informações também são coletadas e usadas com o propósito de melhorar os serviços da INZ e a administração da Lei de Imigração de 2009. As informações que você forneceu serão retidas e se tornarão parte do seu registro de imigração na Nova Zelândia.</p>
                  <p>A INZ também usará o endereço de e-mail fornecido para se comunicar com você sobre sua solicitação, sua viagem para a Nova Zelândia e assuntos relacionados ao seu status de imigração enquanto você estiver na Nova Zelândia.
                  </p>
                  <p>Antes de enviar sua solicitação, certifique-se de ter lido e compreendido os <Link href="/termos" className="underline">Termos de Uso</Link> e a <Link href="/politica-privacidade" className="underline">Política de Privacidade</Link>.</p>
                  <hr className="my-4"/>
                  <h4 className="font-bold">Declaração</h4>
                  <p>Tanto quanto sei, as informações que forneci neste formulário são precisas e respondi às perguntas de forma verdadeira e correta.</p>
                  <p>Forneci uma fotografia do meu rosto que é realmente minha e fiz os esforços necessários ​​para atender aos requisitos de fotografia da NZeTA.</p>
                  <p>Entendo que é minha responsabilidade garantir que os dados do passaporte fornecidos neste formulário correspondam aos detalhes do passaporte que pretendo usar quando viajar para a Nova Zelândia. Verifiquei esses detalhes para confirmar que estão corretos.</p>
                  <p>Entendo que devo cumprir todos os outros requisitos para viajar para a Nova Zelândia.</p>
                  <p>Entendo que a INZ poderá fornecer informações a outras agências na Nova Zelândia e no exterior, onde tal divulgação for exigida ou permitida pela Lei de Privacidade de 1993, ou de outra forma exigida ou permitida por lei. Entendo que minhas informações podem ser usadas para melhorar os serviços da INZ e a administração da Lei de Imigração de 2009.</p>
                  <p>Entendo que a INZ fornecerá informações sobre minha elegibilidade para viajar para a Nova Zelândia, inclusive sobre meu NZeTA, a uma transportadora, inclusive por meio de um sistema de consulta on-line aprovado, a fim de facilitar minha viagem.</p>
                  <p>Você deve confirmar:</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreement"
                        onCheckedChange={() => setAgreement(!agreement)}
                        required
                      />
                      <label
                        htmlFor="agreement"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Eu li e concordo com esta declaração
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        onCheckedChange={() => setTerm(!term)}
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Li e compreendi a Política de Privacidade e os Termos de Uso
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="max-w-60" onClick={(e) => { e.preventDefault(); handleModal(true)}} disabled={isButtonDisabled}>Ir para Pagamento</Button>
            </div>

            { modal && (
              <>
                <div onClick={() => setModal(false)} style={{marginTop: "0px !important"}} className="w-screen h-screen fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                <Card className="max-w-[600px] w-full h-fit fixed translate-x-1/2 z-50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h3 className="text-lg leading-[18px] font-bold">Já finalizou suas solicitações?</h3>
                    <Button variant="outline" className="p-2" onClick={() => handleModal(false)}><X/></Button>
                  </CardHeader>
                  <CardContent>
                    <p>Se deseja adicionar membros da sua família ou amigos, adicione mais uma solicitação para facilitar o seu checkout. Ao clicar em &quot;Ir para Pagamento&apos; você será redirecionado aos métodos de pagamentos disponíveis.</p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        disabled={formState.isSubmitting}
                        onClick={(e) => onSubmit(e, "addAnother")}
                      >
                        Adicionar solicitação <Plus className="ml-1"/>
                      </Button>
                      <Button
                        className="bg-green-600 uppercase hover:bg-green-500"
                        disabled={formState.isSubmitting && agreement && term}
                        onClick={(e) => onSubmit(e, "goToPayment")}
                      >
                        {formState.isSubmitting ? "Salvando informações..." : "Ir para Pagamento"}
                      </Button>
                      </div>
                  </CardContent>
                </Card>
              </>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
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