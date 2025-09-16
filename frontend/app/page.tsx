import LoginForm from "./components/Login";

export default function Home() {
	return (
		<div className="h-screen w-screen flex">
			<img 
				src="background.jpg" 
				className="block w-full h-full object-cover"
				alt="Background"
			/>
			<div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

			<div className="w-1/2 h-full absolute top-0 left-0 flex flex-col justify-center items-center font-lexend">
				<div className="max-w-lg -mt-10">
					<h1 className="text-5xl font-bold text-white">Tu cherches ton âme soeur ?</h1>
					<p className="text-xl font-semibold text-gray-300 mt-4">Matcha est une communauté de célibataires qui se rencontrent et échangent.</p>

					<div className="flex items-center justify-center mt-6">
						<div className="flex -space-x-4">
							<div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
								<img src="model1.jpg" alt="Membre 1" className="w-full h-full object-cover" />
							</div>
							<div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
								<img src="model2.jpg" alt="Membre 2" className="w-full h-full object-cover" />
							</div>
							<div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
								<img src="model3.jpg" alt="Membre 3" className="w-full h-full object-cover" />
							</div>
						</div>
						<p className="text-lg text-gray-300 ml-6">+200k membres actifs</p>
					</div>
				</div>
			</div>

			<LoginForm />
		</div>
	);
}
