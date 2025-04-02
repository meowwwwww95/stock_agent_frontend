"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function LoginPage() {
  const [apiKey, setApiKey] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const login = async (apiKey: string) => {
    const response = await fetch(`http://123.207.217.26:54346/login?apikey=${apiKey}`, {
      method: 'GET',
    })
    return response
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    try {
      const response = await login(apiKey)
      // 处理响应，例如存储token或重定向
      const data = await response.json();
      console.log(data)
      if (response.status == 200){
        localStorage.setItem("username", data.name)
        localStorage.setItem("apiKey", apiKey)
        router.push("/dashboard")
      } else {
        //添加错误弹窗
        toast({
          variant: "destructive",
          title: "登录失败",
          description: data.message,
          action: <ToastAction altText="重试">重试</ToastAction>,
        })
        return
      }
      
    } catch (error) {
      // 处理错误，例如显示错误消息
      console.error('Error:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">股票分析系统</CardTitle>
          <CardDescription className="text-center">请输入您的API密钥以继续</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API密钥</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="输入您的API密钥"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              登录
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

