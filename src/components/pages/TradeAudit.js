import {h} from 'preact';
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-preact'
import { route } from "preact-router"
import { useState } from "preact/hooks"
import { useTrade, ACTION_TYPES } from "../../contexts/TradeContext"

const TradeAudit = ({ id }) => {
  const { getTradeAuditTrail, getTrade } = useTrade()
  const [expandedAction, setExpandedAction] = useState(null)
  const [activeTab, setActiveTab] = useState("Timeline")

  const trade = getTrade(id)
  if (!trade) {
    route("/")
    return null
  }

  const auditTrail = getTradeAuditTrail(id)

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getActionDetails = (record) => {
    switch (record.action) {
      case ACTION_TYPES.CREATED:
        return `Initial trade created with price ₹${record.metadata.initialPrice}`
      case ACTION_TYPES.PRICE_UPDATED:
        return `Price updated to ₹${record.changes.price}`
      case ACTION_TYPES.TARGET_UPDATED:
        return `Targets updated to ₹${record.changes.targets.join(', ₹')}`
      case ACTION_TYPES.STOPLOSS_UPDATED:
        return `Stop loss updated to ₹${record.changes.stopLoss}`
      case ACTION_TYPES.EXITED:
        return `Trade exited at ₹${record.changes.exitPrice} (${record.changes.exitReason})`
      default:
        return record.action
    }
  }

  const getTypeStyle = (type) => {
    return type === 'BUY' 
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700'
  }

  return (
    <div class="min-h-screen bg-white">
      <header class="sticky top-0 z-10 bg-white border-b">
        <div class="px-4 py-3">
          <button onClick={() => route("/")} class="text-gray-600 mb-4 flex items-center gap-1">
            <ArrowLeft class="h-4 w-4" />
            <span>Back</span>
          </button>
          <div class="flex gap-2 items-center mb-4">
            <span class={`px-2 py-1 text-xs rounded font-medium ${getTypeStyle(trade.type)}`}>
              {trade.type}
            </span>
            <span class="font-medium">{trade.tickerSymbol}</span>
            <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">EQUITY</span>
            <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600 flex items-center gap-1">
              <span class="text-xs">×</span>
              {trade.timePeriod}
            </span>
          </div>
          <div class="flex gap-6 border-b">
            {["Timeline", "Prices"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                class={`pb-3 px-1 text-sm font-medium relative ${
                  activeTab === tab ? "text-purple-600" : "text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div class="px-4">
        {activeTab === "Timeline" && (
          <div class="space-y-6 py-4">
            {auditTrail?.map((record, index) => (
              <div key={index} class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div
                    class={`w-2 h-2 rounded-full mt-2 ${
                      expandedAction === index ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  />
                  {index !== auditTrail.length - 1 && (
                    <div class="w-0.5 h-full bg-gray-200 mt-2" />
                  )}
                </div>
                <div class="flex-1">
                  <button
                    onClick={() => setExpandedAction(expandedAction === index ? null : index)}
                    class="w-full text-left"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium">{getActionDetails(record)}</span>
                      {expandedAction === index ? (
                        <ChevronDown class="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight class="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div class="text-sm text-gray-500">
                      {formatDate(record.timestamp)} {formatTime(record.timestamp)}
                    </div>
                  </button>

                  {expandedAction === index && record.changes && (
                    <div class="mt-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      <pre class="whitespace-pre-wrap">
                        {JSON.stringify(record.changes, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "Prices" && (
          <div class="py-4 text-center text-gray-500">
            Price history visualization coming soon
          </div>
        )}
      </div>
    </div>
  )
}

export default TradeAudit