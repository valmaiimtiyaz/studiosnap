import React from 'react';

const foldersData = [
    { name: 'Halloween' },
    { name: 'Farewell Party' },
    { name: 'Christmas' },
    { name: 'New Year' },
];

const FolderCard = ({ name }) => ( 
    <div className="w-[220px] bg-[#6B0D5D] rounded-3xl p-4 flex flex-col items-center">
        
        <div className="w-full h-40 bg-[#FDF2D0] rounded-xl relative overflow-hidden">

            <div className="absolute inset-0 border-[6px] border-[#610049] rounded-xl pointer-events-none"></div>
        </div>
        
        <h3 className="text-[#FCF9E9] text-xl font-bold mt-4 mb-0 text-center">
            {name}
        </h3>
    </div>
);

const Library = () => {
    return (
        <div className="pt-20 pb-10 px-6 min-h-screen"> 
            
            <div className="text-center mb-12 mt-10"> 
                <h2 className="text-[#6B0D5D] text-4xl font-extrabold">
                    A Folder for Every Capture
                </h2>
            </div>

            <div className="flex justify-center space-x-8 mb-16"> 
                {foldersData.map((folder, index) => (
                    <FolderCard 
                        key={index} 
                        name={folder.name} 
                    />
                ))}
            </div>

            <div className="flex justify-center space-x-6">
                <button
                    className="inline-block no-underline bg-[#FCF9E9] text-[#610049] rounded-full px-[40px]
                    py-4 text-[20px] font-bold shadow-[0_2px_25px_#FFA3A3] transition-transform duration-200 
                    hover:scale-105 hover:bg-[#FDF2D0]"
                >
                    add folder
                </button>
                <button
                    className="inline-block no-underline bg-[#FCF9E9] text-[#610049] rounded-full px-[40px]
                    py-4 text-[20px] font-bold shadow-[0_2px_25px_#FFA3A3] transition-transform duration-200 
                    hover:scale-105 hover:bg-[#FDF2D0]"
                >
                    delete folder
                </button>
            </div>
            
        </div>
    );
};

export default Library;