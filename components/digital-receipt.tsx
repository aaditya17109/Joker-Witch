"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Star, QrCode, Download, History, Share2, X, Gift } from "lucide-react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

const Carousel = ({
  children,
  className,
  setApi,
}: { children: React.ReactNode; className: string; setApi: (api: any) => void }) => {
  return <div className={className}>{children}</div>
}

const CarouselContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex">{children}</div>
}

const CarouselItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full flex-shrink-0">{children}</div>
}

export function DigitalReceipt() {
  const [rating, setRating] = useState(0)
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(0)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [showPromoPopup, setShowPromoPopup] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [promoApi, setPromoApi] = useState<any>(null)
  const historyButtonRef = useRef<HTMLButtonElement>(null)

  const receiptData = [
    {
      receiptNumber: "RCP-2025-001234",
      date: "22 Aug 2025",
      time: "14:30 IST",
      items: [
        { name: "Cotton Kurta - Navy Blue", size: "L", qty: 1, price: 2499 },
        { name: "Silk Dupatta - Golden", size: "Free Size", qty: 1, price: 1299 },
        { name: "Palazzo Pants - Cream", size: "M", qty: 1, price: 1899 },
      ],
      subtotal: 5697,
      gst: 569.7, // Simplified GST to single 10% calculation
      total: 6266.7,
      paymentMethod: "UPI - Google Pay",
      transactionId: "TXN123456789",
    },
    {
      receiptNumber: "RCP-2025-001198",
      date: "15 Mar 2025",
      time: "16:45 IST",
      items: [
        { name: "Designer Saree - Red", size: "Free Size", qty: 1, price: 4999 },
        { name: "Blouse - Gold", size: "M", qty: 1, price: 899 },
      ],
      subtotal: 5898,
      gst: 589.8,
      total: 6487.8,
      paymentMethod: "Credit Card",
      transactionId: "TXN123456654",
    },
    {
      receiptNumber: "RCP-2025-001156",
      date: "28 Jan 2025",
      time: "12:20 IST",
      items: [
        { name: "Casual Shirt - White", size: "L", qty: 2, price: 1299 },
        { name: "Formal Trousers - Black", size: "32", qty: 1, price: 1899 },
      ],
      subtotal: 4497,
      gst: 449.7,
      total: 4946.7,
      paymentMethod: "UPI - PhonePe",
      transactionId: "TXN123456321",
    },
  ]

  const currentReceipt = receiptData[selectedReceipt]

  const handleDownloadPDF = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>RDEP Fashion Receipt</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #000; background: #fff; width: 800px; margin: 0 auto; padding: 20px; }
        .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1e3a8a; }
        .logo-section { display: flex; align-items: center; gap: 15px; }
        .company-info h1 { font-size: 24px; color: #1e3a8a; font-weight: bold; margin-bottom: 8px; }
        .company-info p { font-size: 12px; color: #666; line-height: 1.3; }
        .bill-info { text-align: right; font-size: 12px; }
        .bill-info div { margin-bottom: 4px; }
        .bill-id { font-weight: bold; color: #1e3a8a; }
        .tax-invoice { background: #1e3a8a; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-top: 10px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ddd; }
        .items-table th { background: #1e3a8a; color: white; padding: 12px 8px; text-align: left; font-size: 12px; font-weight: bold; }
        .items-table td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 12px; vertical-align: top; }
        .item-name { font-weight: bold; color: #1e3a8a; margin-bottom: 3px; }
        .totals-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .totals-table { text-align: right; }
        .totals-table div { margin-bottom: 5px; font-size: 14px; }
        .net-total { font-weight: bold; font-size: 16px; color: #1e3a8a; border-top: 1px solid #ddd; padding-top: 5px; margin-top: 5px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="receipt-header">
        <div class="logo-section">
            <div class="company-info">
                <h1>RDEP FASHION</h1>
                <p>Premium Fashion Store<br>New Delhi, India<br>Phone: +91 98765 43210<br>GSTIN: 07AABCU9603R1ZX</p>
            </div>
        </div>
        <div class="bill-info">
            <div><strong>Receipt ID:</strong> <span class="bill-id">${currentReceipt.receiptNumber}</span></div>
            <div><strong>Date:</strong> ${currentReceipt.date} ${currentReceipt.time}</div>
            <div class="tax-invoice">TAX INVOICE</div>
        </div>
    </div>
    
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%;">Item Description</th>
                <th style="width: 12%;">Qty</th>
                <th style="width: 13%;">Price</th>
                <th style="width: 13%;">Total</th>
            </tr>
        </thead>
        <tbody>
            ${currentReceipt.items
              .map(
                (item) => `                <tr>
                    <td>
                        <div class="item-name">${item.name}</div>
                        <div>Size: ${item.size}</div>
                    </td>
                    <td>${item.qty}</td>
                    <td>₹${item.price.toLocaleString("en-IN")}</td>
                    <td><strong>₹${(item.price * item.qty).toLocaleString("en-IN")}</strong></td>
                </tr>
            `,
              )
              .join("")}
        </tbody>
    </table>
    
    <div class="totals-section">
        <div>Items Purchased: ${currentReceipt.items.reduce((sum, item) => sum + item.qty, 0)}</div>
        <div class="totals-table">
            <div>Subtotal: <strong>₹${currentReceipt.subtotal.toLocaleString("en-IN")}</strong></div>
            <div>GST (10%): <strong>₹${currentReceipt.gst.toLocaleString("en-IN")}</strong></div>
            <div class="net-total">Total: <strong>₹${currentReceipt.total.toLocaleString("en-IN")}</strong></div>
        </div>
    </div>
    
    <div class="footer">
        <p><strong>Thank you for shopping at RDEP Fashion!</strong></p>
        <p>Visit us at rdepfashion.com or call +91 98765 43210</p>
    </div>
</body>
</html>`

    const element = document.createElement("a")
    const file = new Blob([htmlContent], { type: "text/html" })
    element.href = URL.createObjectURL(file)
    element.download = `RDEP_Receipt_${currentReceipt.receiptNumber}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleShare = async () => {
    const shareData = {
      title: "RDEP Fashion Receipt",
      text: `Receipt #${currentReceipt.receiptNumber} - Total: ₹${currentReceipt.total.toLocaleString("en-IN")}`,
      url: window.location.href,
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const hasWebShare = navigator.share && navigator.canShare && navigator.canShare(shareData)

    if (hasWebShare || (isMobile && navigator.share)) {
      try {
        await navigator.share(shareData)
        return // Successfully shared, don't fall back
      } catch (error: any) {
        // Only fallback if it's not a user cancellation (AbortError)
        if (error.name === "AbortError") {
          return // User cancelled, don't show fallback
        }
        console.log("Share failed, using fallback:", error)
      }
    }

    // Fallback to clipboard for desktop or when native share fails
    fallbackShare()
  }

  const fallbackShare = () => {
    const shareText = `RDEP Fashion Receipt #${currentReceipt.receiptNumber} - Total: ₹${currentReceipt.total.toLocaleString("en-IN")} - ${window.location.href}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
      alert("Receipt details copied to clipboard!")
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = shareText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("Receipt details copied to clipboard!")
    }
  }

  const handleFeedbackSubmit = () => {
    if (rating > 0) {
      setFeedbackSubmitted(true)
      setRating(0)
      setTimeout(() => setFeedbackSubmitted(false), 3000)
    }
  }

  const totalSlides = 2

  useEffect(() => {
    setShowPromoPopup(true)
  }, [])

    // Auto-resize iframe height for WordPress embed
  useEffect(() => {
    const postHeight = () => {
      if (window.parent) {
        window.parent.postMessage(
          { frameHeight: document.body.scrollHeight },
          "*"
        );
      }
    };

    // Run once at mount
    postHeight();

    // Run on resize
    window.addEventListener("resize", postHeight);

    // Watch for DOM changes (collapsible sections, history modal, etc.)
    const observer = new MutationObserver(postHeight);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("resize", postHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-white relative">
      {showPromoPopup && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40"></div>

          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm">
            <div className="bg-white rounded-lg p-4 w-full relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => setShowPromoPopup(false)}
              >
                <X size={16} />
              </Button>
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="relative">
                    <Carousel className="w-full" setApi={setPromoApi}>
                      <CarouselContent>
                        <CarouselItem>
                          <a href="https://www.rdep.io" target="_blank" rel="noopener noreferrer">
                            <div className="w-full">
                              <div className="relative w-full">
                                <Image
                                  src="/festive-sale.jpg"
                                  alt="Festive Season Sale - Upto 30%-40% Off"
                                  width={400}
                                  height={200}
                                  className="w-full h-auto object-contain"
                                />
                              </div>
                            </div>
                          </a>
                        </CarouselItem>
                        <CarouselItem>
                          <a href="https://www.rdep.io/" target="_blank" rel="noopener noreferrer">
                            <div className="w-full">
                              <div className="relative w-full">
                                <Image
                                  src="/festive-sale.jpg"
                                  alt="Festive Season Sale - Extra 10% Off on prepaid Orders"
                                  width={400}
                                  height={200}
                                  className="w-full h-auto object-contain"
                                />
                              </div>
                            </div>
                          </a>
                        </CarouselItem>
                      </CarouselContent>
                    </Carousel>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex justify-start">
            <Image src="/rdep-logo.png" alt="RDEP Fashion" width={120} height={40} className="object-contain" />
          </div>
          <div className="text-right text-sm">
            <p className="text-xs text-slate-500">{currentReceipt.date}</p>
            <p className="text-xs text-slate-500">#{currentReceipt.receiptNumber}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-slate-600 bg-slate-50 p-2 rounded">
          <div className="text-left">
            <p className="text-xs text-slate-500">Amount Paid</p>
            <p className="font-semibold text-blue-900">₹{currentReceipt.total.toLocaleString("en-IN")}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">
              Items:{" "}
              <span className="text-blue-900 font-semibold">
                {currentReceipt.items.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            </p>
          </div>
        </div>

        <Separator />

        <div className="text-left">
          <p className="text-blue-900 font-medium">Hello Aaditya,</p>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-slate-800">Items Purchased</h2>
          <div className="space-y-2">
            {currentReceipt.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start py-2 border-b border-slate-100 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    Size: {item.size} • Qty: {item.qty}
                  </p>
                </div>
                <p className="font-semibold text-sm text-slate-800">₹{item.price.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bill Summary - Simplified GST calculation */}
        <div className="space-y-2">
          <h2 className="font-semibold text-slate-800">Bill Summary</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{currentReceipt.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (10%)</span>
              <span>₹{currentReceipt.gst.toLocaleString("en-IN")}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base text-blue-900">
              <span>Total Amount</span>
              <span>₹{currentReceipt.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Details - Made more compact */}
        <div className="space-y-2">
          <h2 className="font-semibold text-slate-800">Payment Details</h2>
          <div className="bg-slate-50 p-2 rounded space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="font-medium">{currentReceipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-green-600 font-medium">Paid</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3">
          <div className="flex-1">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="text-blue-900" size={16} />
                <span className="font-semibold text-sm text-blue-900">Special Offer!</span>
              </div>
              <p className="text-xs text-blue-800 mb-2">Get 20% off on your next purchase</p>
              <Button size="sm" className="w-full bg-blue-900 text-white text-xs">
                Shop Now
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Loyalty Section */}
        <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-3 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-sm text-blue-900 mb-1">RDEP Loyalty Program</h3>
          <p className="text-xs text-slate-600 mb-2">You earned 62 points from this purchase!</p>
          <div className="flex justify-between text-xs">
            <span className="text-slate-600">Total Points:</span>
            <span className="font-semibold text-blue-900">1,247 points</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h2 className="font-semibold text-slate-800">Rate Your Experience</h2>
          <div className="bg-slate-50 p-3 rounded-lg space-y-3">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`cursor-pointer transition-colors ${
                    star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            {feedbackSubmitted ? (
              <div className="text-center text-green-600 font-medium text-sm">Thank you for your feedback!</div>
            ) : (
              <Button className="w-full bg-blue-900 text-white" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            ref={historyButtonRef}
            variant="outline"
            size="sm"
            className="text-xs border-blue-200 text-blue-900 bg-transparent"
            onClick={() => setShowTransactionHistory(true)}
          >
            <History size={14} className="mr-1" />
            History
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-blue-200 text-blue-900 bg-transparent"
            onClick={handleDownloadPDF}
          >
            <Download size={14} className="mr-1" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-blue-200 text-blue-900 bg-transparent"
            onClick={handleShare}
          >
            <Share2 size={14} className="mr-1" />
            Share
          </Button>
        </div>

        <Separator />

        <div className="text-center space-y-2">
          <h2 className="font-semibold text-slate-800">Store Information</h2>
          <div className="flex justify-center mb-2">
            <div className="bg-slate-50 p-3 rounded-lg">
              <QrCode size={60} className="text-blue-900" />
            </div>
          </div>
          <div className="space-y-1 text-sm text-slate-600">
            <p className="font-medium text-slate-800">RDEP Fashion Store</p>
            <p>123, Fashion Street, Connaught Place</p>
            <p>New Delhi - 110001, India</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ support@rdepfashion.com</p>
            <p className="text-xs">GSTIN: 07AABCU9603R1ZX</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-2">
          <p>Thank you for shopping with RDEP Fashion!</p>
          <p className="mt-1">Visit us again soon</p>
        </div>
      </div>

      {showTransactionHistory && (
        <div
          className="absolute bg-white rounded-lg p-4 w-full max-w-sm max-h-96 overflow-y-auto z-50 shadow-xl border-2 border-blue-100"
          style={{
            top: historyButtonRef.current ? historyButtonRef.current.offsetTop - 150 : "50%",
            left: "0",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-slate-800">Transaction History</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowTransactionHistory(false)}>
              <X size={16} />
            </Button>
          </div>
          <div className="space-y-2">
            {receiptData.map((receipt, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedReceipt === index ? "border-blue-200 bg-blue-50" : "border-slate-200"
                }`}
                onClick={() => {
                  setSelectedReceipt(index)
                  setShowTransactionHistory(false)
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm text-slate-800">#{receipt.receiptNumber}</p>
                    <p className="text-xs text-slate-600">{receipt.date}</p>
                  </div>
                  <p className="font-semibold text-sm text-blue-900">₹{receipt.total.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
