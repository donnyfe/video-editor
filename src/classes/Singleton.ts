export class Singleton {
	private static instance: Singleton | null = null

	public static getInstance(): Singleton {
		if (!Singleton.instance) {
			Singleton.instance = new Singleton()
		}
		return Singleton.instance
	}
}
