'use server'

import { NextResponse } from 'next/server'
import path from 'path' 
import { writeFile } from "fs/promises"

export const POST = async (req: any, res: any) => {
  const formData = await req.formData()

  const file = formData.get("file")
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename =  file.name.replaceAll(" ", "_")

  try {
    const imagePath = path.join(process.cwd(), "uploads/" + filename)
    await writeFile(
      imagePath,
      buffer
    )

    return NextResponse.json({ Message: "Success", status: 201, imagePath: `uploads/${filename}` })
  } catch (e) {
    console.log("Error occured ", e)
    return NextResponse.json({ Message: "Failed", status: 500 })
  }
}
