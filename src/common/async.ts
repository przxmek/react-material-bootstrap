const timeout = async (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export { timeout };