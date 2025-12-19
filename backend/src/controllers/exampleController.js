const getExample = (req, res) => {
    res.json({ message: 'Hello from Example Controller via MVC structure!' });
};

const createExample = (req, res) => {
    const data = req.body;
    res.json({ message: 'Data received', data });
};

module.exports = {
    getExample,
    createExample,
};
