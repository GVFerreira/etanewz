'use client'

import { useRouter } from 'next/navigation'

import { useState } from 'react'
import Select from "react-select"
import { useForm, SubmitHandler } from 'react-hook-form'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from '@/components/ui/use-toast'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import { createVisa } from '@/app/actions'

interface ErrorMsg {
  [key: string]: string | undefined
}

interface FormData {
  passportNationality: string
  passportIssuer: string,
  passportNumber: string,
  passportExpiration: Date
  name: string,
  surname: string,
  hadOtherName: boolean,
  otherName?: string,
  gender: string,
  dateBirth: Date,
  cityBirth: string,
  countryBirth: string,
  nationalDocument: string,
  email: string,
  medicalTreatment: boolean,
  beenDeported: boolean,
  forbiddenEnter: boolean,
  beenConvicted: boolean
}

export default function Data () {
  // const [errors, setErrors] = useState<ErrorMsg>({})
  // const [passport, setPassport] = useState(false)
  // const [otherName, setOtherName] = useState(false)
  // const [firstEmail, setFirstEmail] = useState("")
  // const [secondEmail, setSecondEmail] = useState("")
  // const [eligibility, setEligibility] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, setValue, formState } = useForm<FormData>()

  setValue('passportNationality', 'Brasil')
  setValue('passportIssuer', 'Brasil')
  setValue('countryBirth', 'Brasil')

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await createVisa(data)

      toast({
        title: 'Sucesso',
        description: 'Categoria criada com sucesso'
      })
      router.push('/aplicacao/foto')

    } catch (e) {
      console.log(e)
      toast({
        title: 'Erro',
        description: 'Um erro ocorreu ao criar a categoria'
      })
    } finally {
      router.refresh()
    }
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

  // const handleValidation = () => {
  //   let validationErrors: ErrorMsg = {};
  
  //   if (!emailIsValid(firstEmail, secondEmail)) {
  //     validationErrors['comparing-emails'] = "Os e-mails informados não são iguais."
  //   }

  //   if(!validateDate()) {
  //     validationErrors['validate-date'] = "Sua data de expiração é inválida"
  //   }
  
  //   setErrors(validationErrors)
  
  //   // Retornar se há ou não erros
  //   return Object.keys(validationErrors).length === 0
  // }
  
  // const handleTraveller = (e:any) => {
  //   const choosedDate = new Date(e.target.value).getTime()
  //   const choosedYear = String(new Date(e.target.value).getFullYear())
  //   const currentDate = new Date().getTime()

  //   if (choosedYear.length > 3 && currentDate < choosedDate) { 
  //     setPassport(true)
  //     return true
  //   } else {
  //     setPassport(false)
  //     return false
  //   }
  // }

  // const handleRadioChange = (value: string) => {
  //   setOtherName(value === "true")
  // }

  // const emailIsValid = (first_email: string, second_email: string) => {
  //   return first_email === second_email
  // }

  // const handleFirstEmailBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFirstEmail(e.target.value)
  //   handleValidation() // Dispara a validação ao alterar o valor do primeiro e-mail
  // }
  
  // const handleSecondEmailBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSecondEmail(e.target.value)
  //   handleValidation() // Dispara a validação ao alterar o valor do segundo e-mail
  // }

//   const handleEligibility = () => {
//  }

  const handleNationalityChange = (selectedOption: any) => {
    setValue('passportNationality', selectedOption.value)
  }

  const handleIssuerChange = (selectedOption: any) => {
    setValue('passportIssuer', selectedOption.value)
  }

  const handleCountryBirthChange = (selectedOption: any) => {
    setValue('countryBirth', selectedOption.value)
  }


  return (
    <>
      <Header />
      <main className="container mx-auto my-16">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Solicitação de Autorização Eletrônica de Viagem (eTA)</h1>
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
              <CardContent className="space-y-4 py-4">
                <div>
                  <Label htmlFor="passport_nationality">Selecione sua nacionalidade conforme mostrado no passaporte em que você viajará.</Label>
                  <Select
                    options={countries}
                    defaultValue={{ label: "Brasil", value: "Brasil" }}
                    className="md:w-1/2"
                    onChange={handleNationalityChange}
                    isSearchable
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="passport_issuing-country">Selecione o país ou território emissor conforme mostrado no seu passaporte.</Label>
                  <Select
                    options={countries}
                    defaultValue={{ label: "Brasil", value: "Brasil" }}
                    className="md:w-1/2"
                    onChange={handleIssuerChange}
                    isSearchable
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="passport_number">Digite o número do seu passaporte exatamente como aparece no seu passaporte.</Label>
                  <Input type="text" id="passport_number" className="md:w-1/2" {...register('passportNumber')} />
                </div>
                <div>
                  <Label htmlFor="passport_expiration">Selecione a data de validade conforme mostrada no seu passaporte</Label>
                  <Input type="date" id="passport_expiration" className="md:w-1/2" /* onChange={(handleTraveller)} */ {...register('passportExpiration')}/>
                  {/* {errors['validate-date'] && <p className="text-red-500">{errors['validate-date']}</p>} */}
                </div>
              </CardContent>
            </Card>

            {/* { passport ?  */}
              <>
                <Card id="traveller">
                  <CardHeader>
                    <h3 className="text-lg font-bold">Detalhes do passageiro</h3>
                  </CardHeader>
                  <hr />
                  <CardContent className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="user_name">Insira seu(s) nome(s) próprio(s), incluindo seu(s) nome(s) do meio, conforme mostrado no seu passaporte</Label>
                      <Input type="text" id="user_name" className="md:w-1/2" required {...register('name')}/>
                    </div>
                    <div>
                      <Label htmlFor="user_surname">Insira seu(s) sobrenome(s) conforme mostrado(s) no seu passaporte</Label>
                      <Input type="text" id="user_surname" className="md:w-1/2" required {...register('surname')}/>
                    </div>
                    <div>
                      <Label>Você já foi conhecido por um nome diferente?</Label>
                      <div className="mt-2">
                        <RadioGroup className="flex flex-row gap-5" /* onChange={(e: any) => handleRadioChange(e.target.value)} */ required {...register('hadOtherName')}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="1"
                              id="had-other-name-option-yes"
                            />
                            <Label htmlFor="had-other-name-option-yes">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="0"
                              id="had-other-name-option-no"
                            />
                            <Label htmlFor="had-other-name-option-no">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    {/* {otherName && ( */}
                      <div>
                        <Label htmlFor="user_othername">Insira seu outro nome completo</Label>
                        <Input type="text" id="user_othername" className="md:w-1/2" {...register('otherName')} />
                      </div>
                    {/* )} */}
                    <div>
                      <Label>Selecione seu gênero conforme mostrado no seu passaporte</Label>
                      <div className="mt-2">
                        <RadioGroup required {...register('gender')}>
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
                    </div>
                    <div>
                      <Label htmlFor="user_date-birth">Selecione sua data de nascimento conforme consta no seu passaporte</Label>
                      <Input type="date" id="user_date-birth" className="md:w-1/2" required {...register('dateBirth')}/>
                    </div>
                    <div>
                      <Label htmlFor="user_place-birth">Insira sua cidade de nascimento</Label>
                      <Input type="text" id="user_place-birth" className="md:w-1/2" required {...register('cityBirth')}/>
                    </div>
                    <div>
                      <Label htmlFor="user_country-birth">Selecione seu país ou território de nascimento</Label>
                      <Select
                        options={countries}
                        defaultValue={{ label: "Brasil", value: "Brasil" }}
                        className="md:w-1/2"
                        onChange={handleCountryBirthChange}
                        isSearchable
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_contact-email">Insira um e-mail válido</Label>
                      <Input
                        type="email"
                        id="user_contact-email"
                        className="md:w-1/2"
                        /* onBlur={handleFirstEmailBlur} */
                        required
                        {...register('email')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_contact-email-second">Confirme seu e-mail</Label>
                      <Input
                        type="email"
                        id="user_contact-email-second"
                        className="md:w-1/2"
                        /* onBlur={handleSecondEmailBlur} */
                        required
                      />
                    </div>
                    <div>
                      {/* {errors['comparing-emails'] && <p className="text-red-500">{errors['comparing-emails']}</p>} */}
                    </div>
                    <div>
                      <Label htmlFor="user_national-document">Insira seu CPF, se tiver</Label>
                      <Input type="text" id="user_national-document" className="md:w-1/2" required {...register('nationalDocument')}/>
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
                      <Label>Você vai viajar para a Nova Zelândia para consulta ou tratamento médico?</Label>
                      <div className="mt-2">
                        <RadioGroup className="flex flex-row gap-5" required {...register('medicalTreatment')}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option-one" />
                            <Label htmlFor="option-one">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="option-two" />
                            <Label htmlFor="option-two">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <div>
                      <Label>Você já foi deportado, removido ou excluído de outro país (que não seja a Nova Zelândia)?</Label>
                      <div className="mt-2">
                        <RadioGroup className="flex flex-row gap-5" required {...register('beenDeported')}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option-one" />
                            <Label htmlFor="option-one">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="option-two" />
                            <Label htmlFor="option-two">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <div>
                      <Label>Você está atualmente proibido de entrar na Nova Zelândia após ter sido deportado do país no passado?</Label>
                      <div className="mt-2">
                        <RadioGroup className="flex flex-row gap-5" required {...register('forbiddenEnter')}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option-one" />
                            <Label htmlFor="option-one">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="option-two" />
                            <Label htmlFor="option-two">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <div>
                      <Label>Você já foi condenado por algum crime (em algum país)?</Label>
                      <div className="mt-2">
                        <RadioGroup className="flex flex-row gap-5" required {...register('beenConvicted')}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option-one" />
                            <Label htmlFor="option-one">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="option-two" />
                            <Label htmlFor="option-two">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            {/* : <></>} */}
            

            <Button className="max-w-40"  disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Salvando alterações..." : "Forneça a sua foto"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}