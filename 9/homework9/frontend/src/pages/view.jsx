import {useEffect} from "react";
import {useState} from "react";
import {Link} from "react-router-dom";

export function View() {
	const [posts, setPosts] = useState([]);
	const [id, setId] = useState("");
	const [loading, setLoading] = useState(0);//a loading state
	const [reload, setReload] = useState(0);//a loading state
	useEffect(() => {
		(async function () {
			const req = await fetch("http://localhost:3000/blog/");
			const json = await req.json();
			setPosts(json);
		})();
	}, [reload]);
	async function handleDelete(title) {
		setLoading(1);
		setReload(0);
		const requestData = JSON.stringify({title});
		const headers = {"content-type": "application/json"};
		//is loading content
		//post to the backend
		const resp = await fetch("http://localhost:3000/blog/delete-post", {
			method: "post",
			body: requestData,
			headers: headers
		});
		const json = await resp.json();
		setReload(1);
		setLoading(0);
	}
	if ( loading > 0 ) return (<div>Processing...</div>);//a simple loading page
	return (
		<div>
			<Link to="/"> Home</Link>
			<div>
				My Blogs
			</div>
			<div>
				{posts.map((post) => (
					<div
						style={{
							border: "2px solid",
							width: "50vw",
							margin: "auto",
							textAlign: "center",
						}}
					>
						<h2 style={{margin: "0.2rem"}}>{post.title}</h2>
						<div>{post.content}</div>
						<button onClick={() => handleDelete(post.title)}>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
