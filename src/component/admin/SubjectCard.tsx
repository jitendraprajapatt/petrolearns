export default function SubjectCard({ subject, onDelete }: any) {
    const imageUrl = `http://localhost:5000${subject.image}`;
    console.log(imageUrl);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-80 hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={subject.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-2 px-4">
                    <h3 className="text-white text-xl font-semibold">{subject.name}</h3>
                </div>
            </div>

            <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{subject.description}</p>
                <p className="text-gray-600 mb-4">Topics: {subject.count}</p>
                <div className="flex justify-between items-center mt-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                        Explore
                    </button>
                    <button
                        onClick={() => onDelete(subject._id)}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
