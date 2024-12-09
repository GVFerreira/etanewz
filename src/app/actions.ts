'use server'

import { prisma } from '@/services/database'
import bcrypt from 'bcryptjs'

export async function createVisa(data: any) {
  const codeSalt = bcrypt.genSaltSync(10)
  const codeETA = codeSalt.substring(10, 15).replace(/[^A-Z a-z 0-9]/g, "X").toUpperCase()

  try {
    const destination = await prisma.visa.create({
      data: {
        ...data,
        passportExpiration: new Date(data.passportExpiration),
        hadOtherName: Boolean(data.hadOtherName),
        dateBirth: new Date(data.dateBirth),
        returnToAustralia: data.returnToAustralia === "true",
        stayInNZ: data.stayInNZ === "true",
        medicalTreatment: Boolean(data.medicalTreatment),
        beenDeported: Boolean(data.beenDeported),
        forbiddenEnter: Boolean(data.forbiddenEnter),
        beenConvicted: Boolean(data.beenConvicted),
        convictedMoreThanFive: Boolean(data.convictedMoreThanFive),
        convictedMoreThanTwelve: Boolean(data.convictedMoreThanTwelve),
        codeETA
      }
    })
  
    return destination
  } catch (e) {
    console.log(e)
    return {
      status: 400,
      message: e
    }
  }
}