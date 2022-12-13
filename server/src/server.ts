import app  from "./index"
const port = process.env.PORT || 5000;

app.listen(port, (): void => {
	console.log(`App is listening at http://localhost:${port}`);
});
