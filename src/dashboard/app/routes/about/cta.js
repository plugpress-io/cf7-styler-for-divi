const CTA = () => {
    return (
        <section className="bg-[#454f59] py-16 text-center">
            <div className="container max-w-[50rem] mx-auto flex flex-col items-center justify-center">
                <h2 className="text-[48px] font-bold mb-4 text-slate-50">Need help or advice?</h2>
                <p className="text-slate-200 mb-8">
                    You can always submit a support ticket or ask for help in our friendly Facebook
                    community.
                </p>
                <a
                    href="https://www.facebook.com/groups/divitorque"
                    className="bg-[#4350dc] text-white font-bold text-base px-8 py-3.5 rounded hover:bg-[#4350dc] hover:shadow-lg transition duration-200 ease-in-out hover:text-slate-50"
                >
                    Join Facebook Community
                </a>
            </div>
        </section>
    );
};

export default CTA;
