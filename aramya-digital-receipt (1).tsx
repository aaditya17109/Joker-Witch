"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Gift,
  HelpCircle,
  History,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  PiggyBank,
  Send,
  ShoppingBag,
  Star,
  User2,
  Wallet,
  ThumbsUp,
  Package,
  Share2,
  Facebook,
} from "lucide-react"

interface Receipt {
  id: string
  date: string
  time: string
  cashier: string
  items: Array<{
    id: number
    name: string
    description: string
    price: number
    quantity: number
    category?: string
    gstApplicable?: boolean
    baseAmount?: number
    gst?: number
    sku?: string
    warranty?: string
    gender?: string
  }>
  subtotal: number
  gst: number
  total: number
}

export default function JokerWitchDigitalReceipt() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentSpotlightSlide, setCurrentSpotlightSlide] = useState(0)
  const [showStoreDetails, setShowStoreDetails] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: string[] }>({})
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [currentReceiptId, setCurrentReceiptId] = useState("current")
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [feedback, setFeedback] = useState({
    service: 0,
    staff: 0,
    products: 0,
    pricing: 0,
    store: 0,
    comments: "",
  })
  const [profile, setProfile] = useState({
    mobile: "",
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    email: "",
    loyaltyMember: false,
  })
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // Carousel refs and APIs
  const [promoApi, setPromoApi] = useState<CarouselApi>()
  const [spotlightApi, setSpotlightApi] = useState<CarouselApi>()
  const feedbackButtonRef = useRef<HTMLButtonElement>(null)
  const historyButtonRef = useRef<HTMLButtonElement>(null)

  // Auto-play effect for promo carousel
  useEffect(() => {
    if (!promoApi) return
    const interval = setInterval(() => {
      promoApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [promoApi])

  // Auto-height adjustment inside iFrame
  useEffect(() => {
    const postHeight = () => {
      const marker = document.getElementById("height-marker")
      if (marker) {
        const rect = marker.getBoundingClientRect()
        const height = rect.top + rect.height + window.scrollY
        window.parent.postMessage({ type: "setIframeHeight", height }, "*")
      }
    }

    postHeight()

    const resizeObserver = new ResizeObserver(postHeight)
    resizeObserver.observe(document.body)

    const intervalId = setInterval(postHeight, 500)
    window.addEventListener("resize", postHeight)

    return () => {
      resizeObserver.disconnect()
      clearInterval(intervalId)
      window.removeEventListener("resize", postHeight)
    }
  }, [])

  // Auto-play effect for spotlight carousel
  useEffect(() => {
    if (!spotlightApi) return
    const interval = setInterval(() => {
      spotlightApi.scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [spotlightApi])

  // Update current slide when carousel changes
  useEffect(() => {
    if (!promoApi) return
    promoApi.on("select", () => {
      setCurrentSlide(promoApi.selectedScrollSnap())
    })
  }, [promoApi])

  useEffect(() => {
    if (!spotlightApi) return
    spotlightApi.on("select", () => {
      setCurrentSpotlightSlide(spotlightApi.selectedScrollSnap())
    })
  }, [spotlightApi])

  const receipts: { [key: string]: Receipt } = {
    current: {
      id: "JW210825135286448318",
      date: "21-08-2025",
      time: "13:07:37",
      cashier: "Sales Associate #101",
      items: [
        {
          id: 0,
          name: "Riviera Blue Watch",
          description: "Premium Men's Watch",
          price: 1469.0,
          quantity: 1,
          category: "Watch",
          gstApplicable: true,
          baseAmount: 1398.1,
          gst: 70.9, // 5% GST
          sku: "JWWW783",
          warranty: "1 Year",
        },
        {
          id: 1,
          name: "Jisu Rectangle Sunglasses",
          description: "Unisex Sunglasses",
          price: 1069.0,
          quantity: 1,
          category: "Sunglasses",
          gstApplicable: true,
          baseAmount: 1017.14,
          gst: 51.86, // 5% GST
          sku: "JWSG108",
          gender: "Unisex",
        },
      ],
      subtotal: 2415.24, // Base amount
      gst: 122.76, // Total GST (5%)
      total: 2538.0,
    },
    hist1: {
      id: "JW200725192286448317",
      date: "20-07-2025",
      time: "19:30:15",
      cashier: "Sales Associate #102",
      items: [
        {
          id: 0,
          name: "Duet Lily Luster Watch",
          description: "Elegant Women's Watch",
          price: 1399.0,
          quantity: 1,
          category: "Watch",
          gstApplicable: true,
          baseAmount: 1332.38,
          gst: 66.62, // 5% GST
          sku: "JWWW779",
          warranty: "1 Year",
        },
      ],
      subtotal: 1332.38,
      gst: 66.62,
      total: 1399.0,
    },
    hist2: {
      id: "JW150725204286448316",
      date: "15-07-2025",
      time: "20:45:22",
      cashier: "Sales Associate #103",
      items: [
        {
          id: 0,
          name: "Romulus Black Men's Watch",
          description: "Premium Black Watch",
          price: 2949.0,
          quantity: 1,
          category: "Watch",
          gstApplicable: true,
          baseAmount: 2808.57,
          gst: 140.43, // 5% GST
          sku: "JWMBS88",
          warranty: "1 Year",
        },
        {
          id: 1,
          name: "Urbano Rectangular Aviators",
          description: "Men's Aviator Sunglasses",
          price: 1259.0,
          quantity: 1,
          category: "Sunglasses",
          gstApplicable: true,
          baseAmount: 1199.05,
          gst: 59.95, // 5% GST
          sku: "JWSG130",
          gender: "Men",
        },
      ],
      subtotal: 4007.62,
      gst: 200.38,
      total: 4208.0,
    },
  }

  const currentReceipt = receipts[currentReceiptId]

  const transactionHistory = [
    { id: "current", branch: "Joker & Witch, Mumbai", date: "21-08-2025", amount: 2538.0 },
    { id: "hist1", branch: "Joker & Witch, Mumbai", date: "20-07-2025", amount: 1399.0 },
    { id: "hist2", branch: "Joker & Witch, Mumbai", date: "15-07-2025", amount: 4208.0 },
  ]

  // Function to calculate modal position relative to button
  const calculateModalPosition = (buttonRef: React.RefObject<HTMLElement>) => {
    if (!buttonRef.current) return { top: 0, left: 0 }
    const buttonRect = buttonRef.current.getBoundingClientRect()
    const containerRect = buttonRef.current.closest(".w-full.max-w-md")?.getBoundingClientRect()
    if (!containerRect) return { top: 0, left: 0 }
    // Position modal half above and half below the button
    const modalHeight = 400 // Approximate modal height
    const top = buttonRect.top - containerRect.top - modalHeight / 2 + buttonRect.height / 2
    return { top: Math.max(0, top), left: 0 }
  }

  // Function to toggle product expansion
  const toggleProductExpansion = (productId: number) => {
    if (expandedProducts.includes(productId)) {
      setExpandedProducts(expandedProducts.filter((id) => id !== productId))
      const newExpandedSections = { ...expandedSections }
      delete newExpandedSections[productId]
      setExpandedSections(newExpandedSections)
    } else {
      setExpandedProducts([...expandedProducts, productId])
    }
  }

  // Function to toggle section expansion
  const toggleSectionExpansion = (productId: number, section: string) => {
    const currentSections = expandedSections[productId] || []
    if (currentSections.includes(section)) {
      setExpandedSections({
        ...expandedSections,
        [productId]: currentSections.filter((s) => s !== section),
      })
    } else {
      setExpandedSections({
        ...expandedSections,
        [productId]: [...currentSections, section],
      })
    }
  }

  // Check if a section is expanded
  const isSectionExpanded = (productId: number, section: string) => {
    return (expandedSections[productId] || []).includes(section)
  }

  const handleShare = async () => {
    const shareData = {
      title: "Shop at Joker & Witch - Premium Watches & Sunglasses!",
      text: `Hey! I just shopped at Joker & Witch and found amazing watches and sunglasses! ⌚🕶️

Use my referral code: JW${Math.random().toString(36).substr(2, 6).toUpperCase()}

Experience their premium collection of watches and stylish sunglasses!

Joker & Witch
Premium Watches & Sunglasses
Phone: +91 98765 43210

https://jokerandwitch.com/`,
    }

    // Detect if we're in an iframe
    const isInIframe = window.self !== window.top

    // For iframe environments, use direct sharing URLs
    if (isInIframe) {
      const encodedText = encodeURIComponent(shareData.text)
      const encodedTitle = encodeURIComponent(shareData.title)
      // Detect mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Create sharing URLs for different platforms
      const sharingUrls = {
        whatsapp: `https://wa.me/?text=${encodedText}`,
        telegram: `https://t.me/share/url?url=https://jokerandwitch.com/&text=${encodedText}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
        sms: `sms:?body=${encodedText}`,
      }

      // Try to open sharing options
      if (isMobile) {
        // On mobile, try WhatsApp first, then SMS
        try {
          window.open(sharingUrls.whatsapp, "_blank")
          return
        } catch (error) {
          try {
            window.open(sharingUrls.sms, "_blank")
            return
          } catch (smsError) {
            // Continue to other methods
          }
        }
      }

      // For desktop or if mobile sharing failed, show sharing options
      const shareMenu = document.createElement("div")
      shareMenu.id = "share-modal-" + Date.now()
      shareMenu.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
    ">
      <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 16px;
        ">
          <h3 style="margin: 0; color: #C20000; font-size: 18px;">Share Referral Link</h3>
          <button onclick="document.getElementById('${shareMenu.id}').remove()" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">&times;</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
          <a href="${sharingUrls.whatsapp}" target="_blank" style="
            display: flex;
            align-items: center;
            padding: 12px;
            background: white;
            color: #C20000;
            text-decoration: none;
            border: 2px solid #C20000;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
          ">
            <span style="margin-right: 8px;">📱</span> WhatsApp
          </a>
          <a href="${sharingUrls.telegram}" target="_blank" style="
            display: flex;
            align-items: center;
            padding: 12px;
            background: white;
            color: #C20000;
            text-decoration: none;
            border: 2px solid #C20000;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
          ">
            <span style="margin-right: 8px;">✈️</span> Telegram
          </a>
          <a href="${sharingUrls.twitter}" target="_blank" style="
            display: flex;
            align-items: center;
            padding: 12px;
            background: white;
            color: #C20000;
            text-decoration: none;
            border: 2px solid #C20000;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
          ">
            <span style="margin-right: 8px;">🐦</span> Twitter
          </a>
          <a href="${sharingUrls.email}" style="
            display: flex;
            align-items: center;
            padding: 12px;
            background: white;
            color: #C20000;
            text-decoration: none;
            border: 2px solid #C20000;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
          ">
            <span style="margin-right: 8px;">📧</span> Email
          </a>
          <a href="${sharingUrls.sms}" style="
            display: flex;
            align-items: center;
            padding: 12px;
            background: white;
            color: #C20000;
            text-decoration: none;
            border: 2px solid #C20000;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
          ">
            <span style="margin-right: 8px;">💬</span> SMS
          </a>
        </div>
        <div style="
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        ">
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">Or copy the text:</p>
          <textarea readonly style="
            width: 100%;
            height: 80px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            resize: none;
            font-family: Arial, sans-serif;
          ">${shareData.text}</textarea>
        </div>
        <button onclick="
          const textarea = this.previousElementSibling.querySelector('textarea');
          textarea.select();
          document.execCommand('copy');
          this.textContent = '✓ Copied!';
          setTimeout(() => this.textContent = 'Copy Text', 2000);
        " style="
          width: 100%;
          padding: 12px;
          background: #C20000;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        ">Copy Text</button>
      </div>
    </div>`
      document.body.appendChild(shareMenu)
      return
    }

    // For non-iframe environments, try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (error: any) {
        if (error.name === "AbortError") {
          return
        }
      }
    }

    // Fallback for non-iframe environments
    const encodedText = encodeURIComponent(shareData.text)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      window.open(`https://wa.me/?text=${encodedText}`, "_blank")
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text)
      } catch (error) {
        const textArea = document.createElement("textarea")
        textArea.value = shareData.text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand("copy")
        } catch (execError) {
          console.log("Copy failed")
        }
        textArea.remove()
      }
    }
  }

  const handleEmailReceipt = () => {
    const subject = encodeURIComponent(`Joker & Witch Receipt - ${currentReceipt.id}`)
    const body = encodeURIComponent(`Dear Customer,

Thank you for shopping at Joker & Witch!

Receipt Details:
- Receipt ID: ${currentReceipt.id}
- Date: ${currentReceipt.date} ${currentReceipt.time}
- Total Amount: ₹${currentReceipt.total.toFixed(2)}

Items Purchased:
${currentReceipt.items.map((item) => `- ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join("\n")}

We hope you love your new watches and sunglasses!

Best regards,
Joker & Witch Team
      `)
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
  }

  const handleDownloadReceipt = () => {
    const receiptHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Joker & Witch Receipt</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        color: #000;
        background: #fff;
        width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .receipt-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #C20000;
      }
      
      .logo-section {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      .logo-img {
       width: 120px;
       height: 40px;
       display: flex;
       align-items: center;
       }

       .logo-img img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain; /* keeps aspect ratio */
        }
      
      .company-info h1 {
        font-size: 24px;
        color: #C20000;
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      .company-info p {
        font-size: 12px;
        color: #666;
        line-height: 1.3;
      }
      
      .bill-info {
        text-align: right;
        font-size: 12px;
      }
      
      .bill-info div {
        margin-bottom: 4px;
      }
      
      .bill-id {
        font-weight: bold;
        color: #C20000;
      }
      
      .tax-invoice {
        background: #C20000;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 12px;
        margin-top: 10px;
      }
      
      .customer-section {
        background: #f8f9fa;
        padding: 15px;
        margin-bottom: 20px;
        border-left: 4px solid #C20000;
      }
      
      .customer-section h3 {
        color: #C20000;
        font-size: 16px;
        margin-bottom: 5px;
      }
      
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        border: 1px solid #ddd;
      }
      
      .items-table th {
        background: #C20000;
        color: white;
        padding: 12px 8px;
        text-align: left;
        font-size: 12px;
        font-weight: bold;
      }
      
      .items-table td {
        padding: 10px 8px;
        border-bottom: 1px solid #eee;
        font-size: 12px;
        vertical-align: top;
      }
      
      .item-name {
        font-weight: bold;
        color: #C20000;
        margin-bottom: 3px;
      }
      
      .item-desc {
        font-size: 11px;
        color: #666;
        line-height: 1.3;
      }
      
      .item-specs {
        font-size: 10px;
        color: #888;
        margin-top: 2px;
      }
      
      .totals-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      
      .pieces-purchased {
        font-size: 14px;
        font-weight: bold;
      }
      
      .totals-table {
        text-align: right;
      }
      
      .totals-table div {
        margin-bottom: 5px;
        font-size: 14px;
      }
      
      .net-total {
        font-weight: bold;
        font-size: 16px;
        color: #C20000;
        border-top: 1px solid #ddd;
        padding-top: 5px;
        margin-top: 5px;
      }
      
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 12px;
        color: #666;
      }
      
      .powered-by {
        margin-top: 15px;
        font-style: italic;
        color: #888;
      }
      
      @media print {
        body { -webkit-print-color-adjust: exact; color-adjust: exact; }
      }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="receipt-header">
      <div class="logo-section">
        <div class="logo-img">
  <img src="https://jokerandwitch.com/cdn/shop/files/www-jokerandwitch-com_myshopify_com_logo_350x@2x.png?v=1628183172" alt="Joker & Witch Logo">
</div>
        <div class="company-info">
          <h1>JOKER & WITCH</h1>
          <p>Premium Watches & Sunglasses<br>
          Mumbai, Maharashtra<br>
          Phone: +91 98765 43210<br>
          GSTIN: 27AABCC1234D1Z5</p>
        </div>
      </div>
      <div class="bill-info">
        <div><strong>Receipt ID:</strong> <span class="bill-id">${currentReceipt.id}</span></div>
        <div><strong>Date:</strong> ${currentReceipt.date} ${currentReceipt.time}</div>
        <div><strong>Served by:</strong> ${currentReceipt.cashier}</div>
        <div class="tax-invoice">TAX INVOICE</div>
      </div>
    </div>

    <!-- Customer Section -->
    <div class="customer-section">
      <h3>Customer: Sarah</h3>
      <p>Thank you for choosing Joker & Witch - Premium Watches & Sunglasses!</p>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%;">Item Description</th>
          <th style="width: 12%;">Qty</th>
          <th style="width: 12%;">UOM</th>
          <th style="width: 13%;">Price</th>
          <th style="width: 13%;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${currentReceipt.items
          .map(
            (item) => `
          <tr>
            <td>
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.description}</div>
              ${item.sku ? `<div class="item-specs">SKU: ${item.sku} | ${item.warranty ? `Warranty: ${item.warranty}` : ""} ${item.gender ? `| Gender: ${item.gender}` : ""}</div>` : ""}
            </td>
            <td>${item.quantity}</td>
            <td>Piece</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td><strong>₹${(item.price * item.quantity).toFixed(2)}</strong></td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <!-- Totals Section -->
    <div class="totals-section">
      <div class="pieces-purchased">
        Items Purchased: ${currentReceipt.items.reduce((sum, item) => sum + item.quantity, 0)}
      </div>
      <div class="totals-table">
        <div>Base Amount: <strong>₹${currentReceipt.subtotal.toFixed(2)}</strong></div>
        <div>GST (5%): <strong>₹${currentReceipt.gst.toFixed(2)}</strong></div>
        <div class="net-total">Total: <strong>₹${currentReceipt.total.toFixed(2)}</strong></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Thank you for shopping at Joker & Witch!</strong></p>
      <p>Visit us online at jokerandwitch.com or call +91 98765 43210</p>
      <div class="powered-by">Powered by RDEP</div>
    </div>
</body>
</html>`

    // Create blob and download directly
    const blob = new Blob([receiptHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `JokerWitch_Receipt_${currentReceipt.id}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/919876543210`, "_blank")
  }

  const handleCall = () => {
    window.open(`tel:+919876543210`, "_blank")
  }

  const handleEmail = () => {
    window.open(`mailto:info@jokerandwitch.com`, "_blank")
  }

  // Handle social media links
  const handleSocialLink = (url: string) => {
    window.open(url, "_blank")
  }

  const handleFeedbackSubmit = () => {
    console.log("Feedback submitted:", feedback)
    setFeedbackSubmitted(true)
    setShowFeedbackModal(false)
    setFeedback({
      service: 0,
      staff: 0,
      products: 0,
      pricing: 0,
      store: 0,
      comments: "",
    })
    // Hide success message after 5 seconds
    setTimeout(() => {
      setFeedbackSubmitted(false)
    }, 5000)
  }

  // Handle profile update
  const handleProfileUpdate = () => {
    console.log("Profile updated:", profile)
    setProfileUpdateSuccess(true)
    // Hide success message after 5 seconds
    setTimeout(() => {
      setProfileUpdateSuccess(false)
    }, 5000)
  }

  // Handle feedback modal open
  const handleFeedbackModalOpen = () => {
    const position = calculateModalPosition(feedbackButtonRef)
    setModalPosition(position)
    setShowFeedbackModal(true)
  }

  // Handle transaction history modal open
  const handleTransactionHistoryOpen = () => {
    const position = calculateModalPosition(historyButtonRef)
    setModalPosition(position)
    setShowTransactionHistory(true)
  }

  const totalSlides = 2

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg relative">
        <div className="flex flex-col w-full gap-4 pb-6 px-4">
          {/* Promo Section */}
          <Card className="overflow-hidden border-none shadow-md mt-4">
            <CardContent className="p-0">
              <div className="relative">
                <Carousel className="w-full" setApi={setPromoApi}>
                  <CarouselContent>
                    <CarouselItem>
                      <div className="w-full">
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src="/images/big-bang-sale.webp"
                            alt="Big Bang Sale - Flat 50% Off"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="bg-[#C20000] text-white p-3">
                          <h2 className="text-base font-bold mb-1">Big Bang Sale</h2>
                          <p className="text-xs mb-2 leading-tight">Flat 50% Off on Premium Watches</p>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white text-[#C20000] hover:bg-gray-100 font-semibold text-xs px-2 py-1 h-6"
                          >
                            Shop Now
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="w-full">
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src="/images/couple-rings.webp"
                            alt="Just Launched - Couple Rings Collection"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="bg-[#C20000] text-white p-3">
                          <h2 className="text-base font-bold mb-1">Just Launched</h2>
                          <p className="text-xs mb-2 leading-tight">Couple Rings - Perfect for Special Moments</p>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white text-[#C20000] hover:bg-gray-100 font-semibold text-xs px-2 py-1 h-6"
                          >
                            Shop Now
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {[...Array(totalSlides)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentSlide(index)
                          promoApi?.scrollTo(index)
                        }}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                          currentSlide === index ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </Carousel>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Header */}
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs font-normal border-[#C20000] text-[#C20000]">
                  Tax Invoice
                </Badge>
              </div>
              <div className="flex space-x-3">
                <Button
                  ref={historyButtonRef}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#C20000] hover:bg-[#C20000]/10"
                  title="Transaction History"
                  onClick={handleTransactionHistoryOpen}
                >
                  <History className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#C20000] hover:bg-[#C20000]/10"
                  onClick={handleEmailReceipt}
                >
                  <Mail className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#C20000] hover:bg-[#C20000]/10"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">Receipt ID</div>
                <div className="text-base font-semibold text-[#C20000]">{currentReceipt.id}</div>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                      alt="Receipt QR Code"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Date & Time</span>
                        <span className="text-sm font-medium">
                          {currentReceipt.date} {currentReceipt.time}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Served by</span>
                        <span className="text-sm font-medium">{currentReceipt.cashier}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-32 relative mb-2">
                    <Image src="/images/joker-witch-logo.png" alt="Joker & Witch" fill className="object-contain" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#C20000]">Joker & Witch</h2>
                  <p className="text-xs text-gray-500 text-center">Premium Watches & Sunglasses</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-6 text-xs text-[#C20000] hover:bg-[#C20000]/10"
                    onClick={() => setShowStoreDetails(!showStoreDetails)}
                  >
                    {showStoreDetails ? "Hide Store Details" : "View Store Details"}
                    <ChevronDown
                      className={`h-3 w-3 ml-1 transition-transform duration-200 ${showStoreDetails ? "rotate-180" : ""}`}
                    />
                  </Button>
                  {showStoreDetails && (
                    <div className="text-center animate-in fade-in-50 duration-300">
                      <p className="text-sm text-center text-gray-600 mt-1">
                        48, 1st cross, Chowdappa layout K Narayanapura Main Rd,
                        <br />
                        Dr, post, S.R, K. Nagar, Bengaluru, Karnataka 560077
                      </p>
                      <div className="flex flex-col items-center mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Phone: +91 98765 43210</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>GSTIN: 27AABCC1234D1Z5</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 bg-[#C20000]/10 border-l-4 border-[#C20000] px-4 py-2 rounded-r-lg flex items-center">
                <User2 className="h-5 w-5 mr-2 text-[#C20000]" />
                <h3 className="text-lg font-medium text-[#C20000]">Hello Sarah!</h3>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Details */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center text-[#C20000]">
                  <ShoppingBag className="mr-2 h-5 w-5 text-[#C20000]" />
                  Purchase Details
                </h3>
                <Badge variant="outline" className="text-xs border-[#C20000] text-[#C20000]">
                  {currentReceipt.items.length} Items
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentReceipt.items.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                      onClick={() => toggleProductExpansion(product.id)}
                    >
                      <div className="flex items-center flex-1">
                        <ChevronRight
                          className={`h-4 w-4 mr-2 text-[#C20000] transition-transform duration-200 ${
                            expandedProducts.includes(product.id) ? "rotate-90" : ""
                          }`}
                        />
                        <div className="flex-1">
                          <span className="font-medium text-[#C20000]">{product.name}</span>
                          {product.category && <div className="text-xs text-gray-500 mt-1">{product.category}</div>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-right">
                        <div className="text-sm text-gray-500">Qty: {product.quantity}</div>
                        <div className="font-medium text-[#C20000]">
                          ₹{(product.price * product.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    {expandedProducts.includes(product.id) && (
                      <div className="bg-white p-4 space-y-4 border-t animate-in slide-in-from-top-5 duration-300">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center mb-3">
                            <Package className="h-4 w-4 mr-2 text-[#C20000]" />
                            <span className="font-medium text-[#C20000]">Product Details & GST</span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-start">
                              <span className="text-gray-600 flex-shrink-0">SKU</span>
                              <span className="font-medium text-right ml-4">{product.sku}</span>
                            </div>
                            {product.warranty && (
                              <div className="flex justify-between items-start">
                                <span className="text-gray-600 flex-shrink-0">Warranty</span>
                                <span className="font-medium text-[#C20000] text-right ml-4">{product.warranty}</span>
                              </div>
                            )}
                            {product.gender && (
                              <div className="flex justify-between items-start">
                                <span className="text-gray-600 flex-shrink-0">Gender</span>
                                <span className="font-medium text-right ml-4">{product.gender}</span>
                              </div>
                            )}
                            <div className="border-t pt-2 mt-3">
                              <div className="flex justify-between items-start">
                                <span className="text-gray-600 flex-shrink-0">Base Amount</span>
                                <span className="font-medium text-right ml-4">₹{product.baseAmount?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-gray-600 flex-shrink-0">GST (5%)</span>
                                <span className="font-medium text-right ml-4">₹{product.gst?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Amount</span>
                  <span>₹{currentReceipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (5%)</span>
                  <span>₹{currentReceipt.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600">Total</span>
                  <span className="text-lg text-[#C20000] font-bold">₹{currentReceipt.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <CreditCard className="h-5 w-5 mr-2 text-[#C20000]" />
                  <h4 className="text-sm font-medium">Payment Method</h4>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-[#C20000]" />
                    <span className="text-[#C20000] font-medium">Card Payment</span>
                  </div>
                  <span className="font-medium text-[#C20000]">₹{currentReceipt.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-[#C20000]/10 to-[#C20000]/5">
              <h3 className="text-lg font-semibold flex items-center text-[#C20000]">
                <ThumbsUp className="mr-2 h-5 w-5 text-[#C20000]" />
                Shopping Experience Feedback
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              {feedbackSubmitted ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-[#C20000] mb-1">Thank you for your feedback!</h4>
                  <p className="text-xs text-gray-600">Your feedback helps us improve our service.</p>
                </div>
              ) : (
                <Button
                  ref={feedbackButtonRef}
                  variant="outline"
                  className="w-full border-[#C20000] text-[#C20000] hover:bg-[#C20000]/10 bg-transparent"
                  onClick={handleFeedbackModalOpen}
                >
                  Rate Your Experience
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Refer a Friend */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-[#C20000]/10 to-[#C20000]/5">
              <h3 className="text-lg font-semibold flex items-center text-[#C20000]">
                <Share2 className="mr-2 h-5 w-5 text-[#C20000]" />
                Refer a Friend
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center bg-white p-3 rounded-lg border border-[#C20000]/20">
                <div className="mr-3 bg-[#C20000]/10 p-2 rounded-full">
                  <Gift className="h-6 w-6 text-[#C20000]" />
                </div>
                <div>
                  <p className="text-sm">
                    Refer a friend and both of you earn{" "}
                    <span className="font-medium text-[#C20000]">500 Loyalty Points</span>
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-3 border-[#C20000] text-[#C20000] hover:bg-[#C20000]/10 bg-transparent"
                onClick={handleShare}
              >
                Share Referral Link
              </Button>
            </CardContent>
          </Card>

          {/* Loyalty Program Section */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-0 pt-0 px-0">
              <Tabs defaultValue="loyalty" className="w-full">
                <TabsList className="w-full grid grid-cols-3 rounded-none h-12 bg-gray-100">
                  <TabsTrigger
                    value="loyalty"
                    className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#C20000] data-[state=active]:border-b-2 data-[state=active]:border-[#C20000] transition-all"
                  >
                    Loyalty
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#C20000] data-[state=active]:border-b-2 data-[state=active]:border-[#C20000] transition-all"
                  >
                    Update Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="spotlight"
                    className="rounded-none data-[state=active]:bg-white data-[state=active]:text-[#C20000] data-[state=active]:border-b-2 data-[state=active]:border-[#C20000] transition-all"
                  >
                    Spotlight
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="loyalty" className="mt-0 p-4">
                  <div className="flex flex-col">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-[#C20000]/10 flex items-center justify-center mb-2">
                          <div className="text-[#C20000] font-bold">✨</div>
                        </div>
                        <span className="text-xl font-bold text-[#C20000]">1,250</span>
                        <span className="text-xs text-gray-500 text-center">Loyalty Points</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-[#C20000]/10 flex items-center justify-center mb-2">
                          <PiggyBank className="h-5 w-5 text-[#C20000]" />
                        </div>
                        <span className="text-lg font-bold text-[#C20000]">₹350</span>
                        <span className="text-xs text-gray-500 text-center">Saved This Year</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                          <Gift className="h-5 w-5 text-gray-400" />
                        </div>
                        <span className="text-lg font-bold text-gray-400">3</span>
                        <span className="text-xs text-gray-500 text-center">Free Gifts</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-purple-600 font-medium text-lg">Loyalty Tier: Gold</div>
                          <div className="text-sm flex items-center text-gray-500">
                            <span>Next review: 31-12-2025</span>
                            <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-dashed">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-green-600">
                            <span className="mr-2">✓</span>
                            <span>Exclusive discounts on premium watches</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <span className="mr-2">✓</span>
                            <span>Earn points on every purchase</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <span className="mr-2">✓</span>
                            <span>Free warranty extensions</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <span className="mr-2">✓</span>
                            <span>Early access to new collections</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="profile" className="mt-0 p-4">
                  {profileUpdateSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-[#C20000] mb-2">Profile Updated Successfully!</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        You earned 100 Loyalty Points for updating your profile.
                      </p>
                      <Button
                        variant="outline"
                        className="border-[#C20000] text-[#C20000] hover:bg-[#C20000]/10 bg-transparent"
                        onClick={() => setProfileUpdateSuccess(false)}
                      >
                        Update Again
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4 bg-[#C20000]/10 p-3 rounded-lg">
                        <p className="text-sm text-[#C20000]">
                          Update your profile now to earn 100 Loyalty Points, get personalised offers and loyalty
                          benefits!
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="mobile" className="text-sm font-medium">
                            Mobile
                          </Label>
                          <Input
                            id="mobile"
                            placeholder="Enter your mobile number"
                            value={profile.mobile}
                            onChange={(e) => setProfile((prev) => ({ ...prev, mobile: e.target.value }))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="firstName" className="text-sm font-medium">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              placeholder="First name"
                              value={profile.firstName}
                              onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="lastName" className="text-sm font-medium">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              placeholder="Last name"
                              value={profile.lastName}
                              onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="birthday" className="text-sm font-medium">
                            Birthday
                          </Label>
                          <Input
                            id="birthday"
                            type="date"
                            value={profile.birthday}
                            onChange={(e) => setProfile((prev) => ({ ...prev, birthday: e.target.value }))}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="gender" className="text-sm font-medium">
                            Gender
                          </Label>
                          <Select
                            value={profile.gender}
                            onValueChange={(value) => setProfile((prev) => ({ ...prev, gender: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={profile.email}
                            onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="loyaltyMember"
                            checked={profile.loyaltyMember}
                            onChange={(e) => setProfile((prev) => ({ ...prev, loyaltyMember: e.target.checked }))}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="loyaltyMember" className="text-sm">
                            I want to join the Loyalty Program for exclusive benefits
                          </Label>
                        </div>
                        <Button
                          className="w-full bg-[#C20000] hover:bg-[#C20000]/90 text-white mt-2"
                          onClick={handleProfileUpdate}
                        >
                          Update Profile
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="spotlight" className="mt-0">
                  <Carousel className="w-full" setApi={setSpotlightApi}>
                    <CarouselContent>
                      <CarouselItem>
                        <div className="p-4">
                          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-50">
                            <Image
                              src="/images/pearl-watches.webp"
                              alt="Festive Special Collection - Pearl Watches"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <h3 className="font-medium mt-2 text-[#C20000]">Pearl Watches</h3>
                          <p className="text-sm text-gray-500">Festive special collection - Shop all watches</p>
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="p-4">
                          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-50">
                            <Image
                              src="/images/bracelet-stacks.webp"
                              alt="Latest Launch - Watch Bracelet Stacks"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <h3 className="font-medium mt-2 text-[#C20000]">Watch Bracelet Stacks</h3>
                          <p className="text-sm text-gray-500">
                            Latest launch - Perfect combination of style and elegance
                          </p>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                      {[...Array(totalSlides)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentSpotlightSlide(index)
                            spotlightApi?.scrollTo(index)
                          }}
                          className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            currentSpotlightSlide === index ? "bg-[#C20000]" : "bg-[#C20000]/30"
                          }`}
                        />
                      ))}
                    </div>
                  </Carousel>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          {/* Contact Section */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-[#C20000]/10 to-[#C20000]/5">
              <h3 className="text-lg font-semibold flex items-center text-[#C20000]">
                <Send className="mr-2 h-5 w-5 text-[#C20000]" />
                Contact Us
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="bg-white border border-gray-100 rounded-lg shadow-sm p-3 flex flex-col items-center transition-all hover:border-[#C20000]/30 hover:shadow"
                >
                  <div className="bg-green-50 p-2 rounded-full mb-2">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-sm font-medium">Chat now</span>
                </button>
                <button
                  onClick={handleCall}
                  className="bg-white border border-gray-100 rounded-lg shadow-sm p-3 flex flex-col items-center transition-all hover:border-[#C20000]/30 hover:shadow"
                >
                  <div className="bg-gray-50 p-2 rounded-full mb-2">
                    <Phone className="h-5 w-5 text-gray-700" />
                  </div>
                  <span className="text-sm font-medium">Call us</span>
                </button>
                <button
                  onClick={handleEmail}
                  className="bg-white border border-gray-100 rounded-lg shadow-sm p-3 flex flex-col items-center transition-all hover:border-[#C20000]/30 hover:shadow"
                >
                  <div className="bg-blue-50 p-2 rounded-full mb-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Email us</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Section */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-[#C20000]/10 to-[#C20000]/5">
              <h3 className="text-lg font-semibold flex items-center text-[#C20000]">
                <ExternalLink className="mr-2 h-5 w-5 text-[#C20000]" />
                Follow Us
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-around">
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 mb-1"
                    onClick={() => handleSocialLink("https://www.instagram.com/jokerandwitch/?hl=en")}
                  >
                    <Instagram className="h-6 w-6 text-white" />
                  </Button>
                  <span className="text-xs">Instagram</span>
                </div>
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-blue-600 mb-1"
                    onClick={() => handleSocialLink("https://www.facebook.com/jokerandwitch/")}
                  >
                    <Facebook className="h-6 w-6 text-white" />
                  </Button>
                  <span className="text-xs">Facebook</span>
                </div>
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-[#C20000] mb-1"
                    onClick={() => handleSocialLink("https://jokerandwitch.com/")}
                  >
                    <ExternalLink className="h-6 w-6 text-white" />
                  </Button>
                  <span className="text-xs">Website</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-[#C20000]/10 to-[#C20000]/5">
              <h3 className="text-lg font-semibold flex items-center text-[#C20000]">
                <FileText className="mr-2 h-5 w-5 text-[#C20000]" />
                Terms and Conditions
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-between text-[#C20000] hover:bg-[#C20000]/10"
                onClick={() => setShowTerms(!showTerms)}
              >
                <span>View Terms and Conditions</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showTerms ? "rotate-180" : ""}`} />
              </Button>
              {showTerms && (
                <div className="text-sm text-gray-600 mt-2 space-y-2 animate-in fade-in-50 duration-300">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>All purchases are subject to Joker & Witch's standard terms and conditions.</li>
                    <li>
                      Returns and exchanges must be made within 7 days of purchase with original packaging and receipt.
                    </li>
                    <li>Prices include GST where applicable. GST is calculated at 5% on watches and sunglasses.</li>
                    <li>Joker & Witch is not responsible for personal belongings left unattended in the store.</li>
                    <li>
                      Loyalty program benefits are subject to separate terms and conditions available at
                      jokerandwitch.com.
                    </li>
                    <li>Loyalty points are earned on eligible purchases and credited within 7 business days.</li>
                    <li>Any disputes are subject to Mumbai jurisdiction.</li>
                    <li>Store timings: 10:00 AM to 9:00 PM (Monday to Sunday).</li>
                    <li>Watch servicing and repairs are chargeable and subject to availability.</li>
                    <li>Custom orders require advance payment and are non-refundable.</li>
                    <li>All watches come with manufacturer warranty as specified on the product.</li>
                    <li>Sunglasses are covered under standard warranty terms for manufacturing defects only.</li>
                  </ol>
                  <div className="mt-4 pt-4 border-t border-dashed">
                    <h4 className="font-medium mb-1">Customer Care</h4>
                    <p className="text-xs">
                      For any queries regarding your purchase, please contact our customer care team on +91 98765 43210
                      or visit jokerandwitch.com. We're here to provide you with premium watches and sunglasses.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Powered by RDEP */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-500">Powered by</span>
                <div className="h-6 w-16 relative">
                  <Image
                    src="https://www.rdep.io/wp-content/uploads/2023/03/RDEP-cropped.png"
                    alt="RDEP"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div id="height-marker" style={{ height: "1px" }} />
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="absolute inset-0 bg-black/50 flex items-start justify-center z-50 animate-in fade-in-0 duration-300 px-4">
            <div
              className="bg-white rounded-lg w-full overflow-hidden shadow-xl max-w-sm"
              style={{
                marginTop: `${modalPosition.top}px`,
              }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-[#C20000]">How was your shopping experience?</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowFeedbackModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </Button>
              </div>
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {[
                  { key: "service", label: "Customer Service" },
                  { key: "staff", label: "Staff Helpfulness" },
                  { key: "products", label: "Product Quality" },
                  { key: "pricing", label: "Value for Money" },
                  { key: "store", label: "Store Experience" },
                ].map((category) => (
                  <div key={category.key} className="flex items-center justify-between">
                    <span className="text-sm">{category.label}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            setFeedback((prev) => ({ ...prev, [category.key as keyof typeof feedback]: star }))
                          }
                        >
                          <Star
                            className={`h-5 w-5 ${
                              feedback[category.key as keyof typeof feedback] >= star
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                <Textarea
                  placeholder="Please share your feedback (optional)"
                  className="mt-2"
                  value={feedback.comments}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, comments: e.target.value }))}
                />
              </div>
              <div className="p-4 border-t">
                <Button className="w-full bg-[#C20000] hover:bg-[#C20000]/90 text-white" onClick={handleFeedbackSubmit}>
                  Submit Feedback
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History Modal */}
        {showTransactionHistory && (
          <div className="absolute inset-0 bg-black/50 flex items-start justify-center z-50 animate-in fade-in-0 duration-300 px-4">
            <div
              className="bg-white rounded-lg w-full overflow-hidden shadow-xl max-w-sm"
              style={{
                marginTop: `${modalPosition.top}px`,
              }}
            >
              <div className="flex justify-between items-center p-4 border-b bg-[#C20000] text-white">
                <h3 className="text-lg font-semibold flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Purchase History
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-[#C20000]/80"
                  onClick={() => setShowTransactionHistory(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto p-3">
                <div className="space-y-3">
                  {transactionHistory.map((transaction) => (
                    <button
                      key={transaction.id}
                      onClick={() => {
                        setCurrentReceiptId(transaction.id)
                        setShowTransactionHistory(false)
                      }}
                      className="w-full flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-[#C20000]/30 transition-all cursor-pointer"
                    >
                      <div className="bg-[#C20000]/10 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-[#C20000]" />
                      </div>
                      <div className="flex-grow text-left">
                        <div className="font-medium text-sm">{transaction.branch}</div>
                        <div className="text-gray-500 text-xs">{transaction.date}</div>
                      </div>
                      <div className="font-semibold text-[#C20000]">₹{transaction.amount.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-3 border-t bg-gray-50">
                <Button
                  variant="outline"
                  className="w-full border-[#C20000] text-[#C20000] hover:bg-[#C20000]/10 bg-transparent"
                  onClick={() => setShowTransactionHistory(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
