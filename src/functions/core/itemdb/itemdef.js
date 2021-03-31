import ids from './itemids'

const db = {
	[ids.ANCIENT_CAPE]: {
		resourceviewid: 'ancientcape',
		name: 'Ancient Cape',
		armor: true,
		equipment: true
	},
	[ids.CRITICAL_RING]: {
		resourceviewid: 'criticalring',
		name: 'Critical Ring',
		equipment: true
	},
	[ids.ORIDECON]: {
		resourceviewid: 'oridecon',
		name: 'Oridecon',
		stackable: true
	},
	[ids.ELUNIUM]: {
		resourceviewid: 'elunium',
		name: 'Elunium',
		stackable: true
	},
	[ids.ZENY]: {
		resourceviewid: 'zeny',
		name: 'Zeny',
		stackable: true,
		currency: true
	}
}

export {
	ids,
	db
}
