import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'
import { IS_DEV_ENV } from '../common/is-dev'
import type { SessionMetadata } from '../../core/interfaces/session-metadata'

import DeviceDetector = require('device-detector-js')

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

export function getSessionMetadata(req: Request, userAgent: string): SessionMetadata {
	const ip = getClientIp(req)
	const location = lookup(ip) || { country: '', city: '', ll: [0, 0] }
	const device = new DeviceDetector().parse(userAgent)

	return {
		location: {
			country: countries.getName(location?.country, 'en') || 'Unknown',
			city: location?.city || 'Unknown',
			latidute: location?.ll?.[0] || 0,
			longitude: location?.ll?.[1] || 0
		},
		device: {
			browser: device.client?.name || 'Unknown',
			os: device.os?.name || 'Unknown',
			type: device.device?.type || 'Unknown'
		},
		ip
	}
}

function getClientIp(req: Request): string {
	if (IS_DEV_ENV) {
		return '173.166.164.121'
	}

	const cfIp = req.headers['cf-connecting-ip']
	if (Array.isArray(cfIp)) {
		return cfIp[0]
	}
	if (cfIp) {
		return cfIp
	}

	const forwardedIp = req.headers['x-forwarded-for']
	if (typeof forwardedIp === 'string') {
		return forwardedIp.split(',')[0]
	}

	return req.ip
}
