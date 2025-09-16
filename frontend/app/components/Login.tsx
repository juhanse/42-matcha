"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation'

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const api = process.env.NEXT_PUBLIC_API_URL;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(`${api}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Erreur de connexion')
			}

			localStorage.setItem('user', JSON.stringify(data.user))

			router.push('/home')
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
			} else {
				setError('Une erreur est survenue. Veuillez réessayer.')
			}
			console.error('Erreur de connexion:', error)
		}
	};

	return (
		<div className="absolute top-0 right-0 h-full flex items-center justify-center pr-16">
			{error && <div className="text-red-500 mt-2 w-full text-center">{error}</div>}

			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
			>
				<h2 className="text-2xl font-bold mb-6 text-center">Se connecter</h2>

				<div className="mb-4">
					<label htmlFor="email" className="block text-gray-700 mb-2">
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="mb-4">
					<label htmlFor="password" className="block text-gray-700 mb-2">
						Mot de passe
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
					Connexion
				</button>

				<p className="mt-4 text-sm text-center text-gray-600">
					<a href="#" className="text-blue-500 hover:underline">
						Mot de passe oublié ?
					</a>
				</p>
			</form>
		</div>
	);
}
