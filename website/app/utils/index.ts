const classNames = (...args: any[]) => {
    return args.filter(Boolean).join(' ');
};

export {
    classNames
};