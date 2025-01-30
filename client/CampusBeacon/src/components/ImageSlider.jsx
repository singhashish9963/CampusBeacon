const ImageSlider = () => {
  const clubs = [
    {
      title: "Coding Club",
      description: "Explore the world of programming and development",
      icon: "💻",
      image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
    },
    {
      title: "Robotics Club",
      description: "Build and program the future of automation",
      icon: "🤖",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a2aa",
    },
    {
      title: "Cultural Club",
      description: "Express creativity through art and performance",
      icon: "🎭",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    },
    {
      title: "Sports Club",
      description: "Compete and excel in various athletics",
      icon: "⚽",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    },
  ];

  const [currentClub, setCurrentClub] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentClub((prev) => (prev + 1) % clubs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl">
      {clubs.map((club, index) => (
        <motion.div
          key={club.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentClub ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={club.image}
            alt={club.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          <div className="absolute bottom-8 left-8 text-white max-w-xl">
            <div className="text-5xl mb-4">{club.icon}</div>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold mb-2"
            >
              {club.title}
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-lg text-gray-200"
            >
              {club.description}
            </motion.p>
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-4 right-4 flex space-x-3">
        {clubs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentClub(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentClub
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
export  default ImageSlider;