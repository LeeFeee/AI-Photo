type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
}

/**
 * Simple structured logger for server-side operations
 * In production, this could be extended to send logs to a service like DataDog, Sentry, etc.
 */
class Logger {
  private formatLog(entry: LogEntry): string {
    const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : ''
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`
  }

  private createEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    const entry = this.createEntry('info', message, context)
    console.log(this.formatLog(entry))
  }

  warn(message: string, context?: Record<string, unknown>) {
    const entry = this.createEntry('warn', message, context)
    console.warn(this.formatLog(entry))
  }

  error(message: string, context?: Record<string, unknown>) {
    const entry = this.createEntry('error', message, context)
    console.error(this.formatLog(entry))
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      const entry = this.createEntry('debug', message, context)
      console.debug(this.formatLog(entry))
    }
  }
}

export const logger = new Logger()

/**
 * Metrics tracking (placeholder for future implementation)
 */
interface Metric {
  name: string
  value: number
  unit: 'ms' | 'count' | 'bytes'
  tags?: Record<string, string>
}

class MetricsCollector {
  track(metric: Metric) {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Metric tracked', metric as unknown as Record<string, unknown>)
    }
    // In production, send to monitoring service (e.g., DataDog, Prometheus)
  }

  trackDuration(name: string, durationMs: number, tags?: Record<string, string>) {
    this.track({
      name,
      value: durationMs,
      unit: 'ms',
      tags,
    })
  }

  trackCount(name: string, count: number, tags?: Record<string, string>) {
    this.track({
      name,
      value: count,
      unit: 'count',
      tags,
    })
  }
}

export const metrics = new MetricsCollector()
