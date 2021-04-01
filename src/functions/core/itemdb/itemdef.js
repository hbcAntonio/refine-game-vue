import ids from './itemids'

const db = {
	[ids.ANCIENT_CAPE]: {
		resourceviewid: 'ancientcape',
		name: 'Ancient Cape',
		armor: true,
		equipment: true,
		description: 'A very old, ancient cape. Ignore defense +15%.',
		basePrice: 980000,
	},
	[ids.CRITICAL_RING]: {
		resourceviewid: 'criticalring',
		name: 'Critical Ring',
		equipment: true,
		description: 'This item makes the wearer more aggressive! Crit +5, Dex + 3. When refine +8, Atk + 2%. When Refine +12, Dex +5, Crit +6, Atk + 4%.',
		basePrice: 450000
	},
	[ids.ORIDECON]: {
		resourceviewid: 'oridecon',
		name: 'Oridecon',
		stackable: true,
		description: 'Rare stone used to apprimorate high-grade weapons',
		basePrice: 25000
	},
	[ids.ELUNIUM]: {
		resourceviewid: 'elunium',
		name: 'Elunium',
		stackable: true,
		description: 'Rare stone used to apprimorate high-grade armors',
		basePrice: 25000
	},
	[ids.ZENY]: {
		resourceviewid: 'zeny',
		name: 'Zeny',
		stackable: true,
		currency: true,
		description: 'Rune-midgard currency.',
		basePrice: 1
	}
}

export {
	ids,
	db
}
