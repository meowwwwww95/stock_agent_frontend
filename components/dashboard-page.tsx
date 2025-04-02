"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"

// Define types for our form and results
type InputForm = {
  stockCode: string
  newsCount: number
  initialCapital: number
  currentPosition: number
}

type AgentResult = {
  agent: string
  signal: string
  confidence: number
}

type AnalysisResult = {
  recommendation: string
  amount: number
  confidence: number
  reason: string
  report: string
  agentResults: AgentResult[]
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<InputForm>({
    stockCode: "",
    newsCount: 10,
    initialCapital: 10000,
    currentPosition: 0,
  })

  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState<string>("")

  // Check if user is logged in and extract username
  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey")
    if (!apiKey) {
      router.push("/")
    } else {
      // 从 API 密钥中提取或生成用户名
      // 这里只是一个示例，实际应用中可能需要从后端获取用户信息
      // 或者在登录时存储用户名
      const getUsername = localStorage.getItem("username") || "";
      setUsername(getUsername)
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "stockCode" ? value : Number(value),
    })
  }

  const stockAnalysis = async (stock_code: string, num_of_news:string, initial_capital:string, initial_stock:string) => {
    const apiKey = localStorage.getItem("apiKey") || ""
    const response = await fetch(`http://123.207.217.26:54346/analyze_stock?stock_code=${stock_code}&num_of_news=${num_of_news}&initial_capital=${initial_capital}&initial_stock=${initial_stock}`, {
      method: 'GET',
      headers: {
        'apikey': apiKey, // 替换为你的API密钥
      }
    })
    return response
  }

  const validateForm = (): boolean => {
    // 验证股票代码
    if (!formData.stockCode.trim()) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "请输入有效的股票代码",
        action: <ToastAction altText="确定">确定</ToastAction>,
      })
      return false
    }

    // 验证股票代码格式（简单示例：字母+数字组合）
    // const stockCodeRegex = /^[A-Za-z0-9.]+$/
    // if (!stockCodeRegex.test(formData.stockCode)) {
    //   toast({
    //     variant: "destructive",
    //     title: "验证失败",
    //     description: "股票代码格式不正确，请使用字母和数字",
    //     action: <ToastAction altText="确定">确定</ToastAction>,
    //   })
    //   return false
    // }

    // 验证新闻数量
    if (formData.newsCount <= 0) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "搜索新闻数必须大于0",
        action: <ToastAction altText="确定">确定</ToastAction>,
      })
      return false
    }

    // 验证初始资金
    if (formData.initialCapital <= 0) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "初始资金必须大于0",
        action: <ToastAction altText="确定">确定</ToastAction>,
      })
      return false
    }

    // 验证持有头寸
    if (formData.currentPosition < 0) {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "持有头寸不能为负数",
        action: <ToastAction altText="确定">确定</ToastAction>,
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证表单
    if (!validateForm()) {
      return
    }

    setLoading(true)

    // // Simulate API call with mock data
    // setTimeout(() => {
    //   const mockResults: AnalysisResult = {
    //     recommendation: "买入",
    //     amount: 100,
    //     confidence: 0.85,
    //     reason: "基于技术分析和新闻情绪，该股票显示出强劲的上涨趋势",
    //     report:
    //       "根据最近的市场数据和新闻分析，该股票在过去30天内呈现出积极的增长模式。技术指标如MACD和RSI表明买入信号强烈。新闻情绪分析显示积极情绪占主导地位。",
    //     agentResults: [
    //       { agent: "技术分析Agent", signal: "买入", confidence: 0.9 },
    //       { agent: "基本面分析Agent", signal: "买入", confidence: 0.8 },
    //       { agent: "新闻情绪Agent", signal: "买入", confidence: 0.85 },
    //       { agent: "市场趋势Agent", signal: "持有", confidence: 0.7 },
    //       { agent: "风险评估Agent", signal: "买入", confidence: 0.75 },
    //     ],
    //   }

    //   setResults(mockResults)
    //   setLoading(false)

    //   // 显示分析成功的提示
    //   toast({
    //     title: "分析完成",
    //     description: `已成功分析股票 ${formData.stockCode}`,
    //   })
    // }, 1500)
    try {
      const response = await stockAnalysis(formData.stockCode, formData.newsCount.toString(), formData.initialCapital.toString(), formData.currentPosition.toString())
      console.log(response)
      const data = await response.json();
      console.log(data)
      if (response.status == 200){

          const fullMessage : string = data.message
          console.log(fullMessage);
          const detailedAnalysis : string  = fullMessage.split("Final Result:")[1].trim();
          console.log(detailedAnalysis); // 输出: "详细分析:{"..."}"
          const overview : string = detailedAnalysis.split('"analysis_report":')[0]
          console.log(overview); // 输出: "详细分析:{"..."}"
          const lastCommaIndex = overview.lastIndexOf(',');
          const newOverview = overview.substring(0, lastCommaIndex) + '}'
          console.log(newOverview)
          const analysisReport : string = detailedAnalysis.split('"analysis_report":')[1]
          console.log(analysisReport); // 输出: "详细分析:{"..."}"
          const firstEqualsIndex = analysisReport.indexOf('====================================');
          const secondEqualsIndex = analysisReport.indexOf('====================================', firstEqualsIndex + 36);
          // console.log(secondEqualsIndex)
          const lastEqualsIndex = analysisReport.lastIndexOf('====================================');
          const extracted = analysisReport.substring(secondEqualsIndex + 36, lastEqualsIndex).trim();
          // console.log("analysis")
          // console.log(extracted)
          try {
            const jsonObject = JSON.parse(newOverview);
            console.log(jsonObject);
            
            const actionMap: { [key: string]: string } = {
              buy: "买入",
              hold: "持有",
              sell: "卖出",
            };
            
            jsonObject.action = actionMap[jsonObject.action] || jsonObject.action;

            type AgentSignal = {
              agent: string;
              signal: string;
              confidence: number;
            };
            jsonObject.agent_signals.forEach((item:AgentSignal) => {
              // console.log(item);
              if(item.agent == "风险管理"){
                item.signal = actionMap[item.signal] ||item.signal;
              } else{
                const signalMap: { [key: string]: string } = {
                  bearish: "看跌",
                  neutral: "中立",
                  bullish: "看涨",
                };
                item.signal = signalMap[item.signal] ||item.signal;
              }
            });

            const res: AnalysisResult = {
              recommendation: jsonObject.action,
              amount: jsonObject.quantity,
              confidence: jsonObject.confidence,
              reason: jsonObject.reasoning,
              report: extracted,
              agentResults: jsonObject.agent_signals
            }
            setResults(res)
          } catch (error) {
            console.error("解析错误：", error);
          }
      } else {
        //添加错误弹窗
        toast({
          variant: "destructive",
          title: "分析失败",
          description: "请联系管理员." + data.message,
          action: <ToastAction altText="确定">确定</ToastAction>,
        })
      }
    } catch (error) {
      // 处理错误，例如显示错误消息
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("apiKey")
    router.push("/")
  }

  // 获取用户头像的首字母
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">股票分析系统</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`} alt={username} />
                  <AvatarFallback>{getInitials(username)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{username}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Input Section */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>输入参数</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stockCode">股票代码</Label>
                <Input
                  id="stockCode"
                  name="stockCode"
                  placeholder="仅适用A股代码"
                  value={formData.stockCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newsCount">搜索新闻数</Label>
                <Input
                  id="newsCount"
                  name="newsCount"
                  type="number"
                  min="1"
                  value={formData.newsCount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialCapital">初始资金</Label>
                <Input
                  id="initialCapital"
                  name="initialCapital"
                  type="number"
                  min="0"
                  value={formData.initialCapital}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPosition">持有头寸</Label>
                <Input
                  id="currentPosition"
                  name="currentPosition"
                  type="number"
                  min="0"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "分析中..." : "分析"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>分析结果</CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>行为建议</Label>
                    <div className="text-xl font-bold">{results.recommendation}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>数目</Label>
                    <div className="text-xl font-bold">{results.amount}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>信心指数</Label>
                    <div className="text-xl font-bold">{(results.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>原因</Label>
                  <p>{results.reason}</p>
                </div>

                <div className="space-y-2">
                  <Label>分析报告</Label>
                  <p className="text-sm text-muted-foreground">{results.report}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Agent 分析结果</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.agentResults.map((agent, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{agent.agent}</span>
                            <Badge
                              variant={
                                agent.signal === "买入"
                                  ? "default"
                                  : agent.signal === "卖出"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {agent.signal}
                            </Badge>
                          </div>
                          <div className="text-sm">信心指数: {(agent.confidence * 100).toFixed(0)}%</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p>输入参数并点击"分析"按钮以获取结果</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

