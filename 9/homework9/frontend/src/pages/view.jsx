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
	let loader=1

	async function reload_posts() {
		const req = await fetch("http://localhost:3000/blog/");
		const json = await req.json();
		setPosts(json);
	}


	async function handleEdit(title, body, functionality) {
		setLoading(1);
		let password=window.prompt("You have a password for that request buddy?","uber_secret_password")//TODO revert
		const requestData = JSON.stringify({password});
		const headers = {"content-type": "application/json"};
		const view_auth_resp = await fetch("http://localhost:3000/blog/authenticate", {
			method: "post",
			body: requestData,
			headers: headers
		});
		const view_auth_resp_json = await view_auth_resp.json();
		setLoading(0);
		if (view_auth_resp_json.success) {//hope you're hungry for some spaghetti code
			if (functionality==0) {//delete route
				setLoading(1);
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
				setReload(++loader);
				setLoading(0);
			} else {//pls don't look at my spaghetti
				let new_title=title
				let new_body=body
				if (functionality==1) {
					new_title=window.prompt("What would you like the new title to be?",title)
				} else {
					new_body=window.prompt("What would you like the new body to be?",body)
				}
				if ( ! new_title ){
					window.alert("title required")
				} else if ( ! new_body ) {
					window.alert("content required")
				} else if ( new_body == body && title == new_title ) {
					window.alert("no change detected")
				} else {// proceed
					const requestData = JSON.stringify({title,new_title,new_body});
					const headers = {"content-type": "application/json"};
					//is loading content
					//post to the backend
					const resp = await fetch("http://localhost:3000/blog/replace-post", {
						method: "post",
						body: requestData,
						headers: headers
					});
					const json = await resp.json();
					setLoading(0);
					if (json.hasOwnProperty('success')) {
						if ( json.success == 'false' ) {
							window.alert("Duplicate titles not allowed");
						}
					} else {
						window.alert("Some other error occured");
					}
					setReload(++loader);
				}
			}
		} else {
			if ( password !== null ) {
				window.alert("Incorrect Password");
				setReload(++loader);
			}
		}
		reload_posts();
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
						<button onClick={() => handleEdit(post.title, post.content, 0)}>
							Delete
						</button>
						<button onClick={() => handleEdit(post.title, post.content, 1)}>
							Edit title
						</button>
						<button onClick={() => handleEdit(post.title, post.content, 2)}>
							Edit content
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
