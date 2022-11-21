import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

export function Create() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [password, setPassword] = useState("");
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(0);//a loading state
	const [incomplete, setIncomplete] = useState(0);//the form not filled in correctly
	async function handleSubmit(e) {
		setDone(false)
		if ((title=="") ||  (content=="")) {
			if (content !=""){
				setIncomplete(1)
			} else {
				setIncomplete(2)
			}
		} else {
			e.preventDefault();
			setIncomplete(0)//is complete
			const requestData = JSON.stringify({password});
			const headers = {"content-type": "application/json"};
			setLoading(1);
			const auth_resp = await fetch("http://localhost:3000/blog/authenticate", {
				method: "post",
				body: requestData,
				headers: headers
			});
			const auth_resp_json = await auth_resp.json();
			if (auth_resp_json.success) {//pls don't look at my spaghetti
				const requestData = JSON.stringify({title, content, password});//i was thinking of authenticating here to reduce server calls but this could be an attack vector
				//is loading content
				//post to the backend
				const resp = await fetch("http://localhost:3000/blog/create-post", {
					method: "post",
					body: requestData,
					headers: headers
				});
				const json = await resp.json();
				if (json.hasOwnProperty('success') && json.success == 'false' ) {
					setLoading(2);//error state
					setIncomplete(3);//notify about the duplicate title
				} else {
					setDone(true);
				}
			} else {
				setIncomplete(4)
			}//ma'ma mia
			setLoading(0);
		}
	}
	if (incomplete > 0) {
		window.alert(incomplete == 1 ? "Title required" : ( incomplete == 2 ? "Body text required" : (incomplete == 3 ? "Title already exists. The title must be unique. Please enter a different title." : "incorrect password" )));
		setIncomplete(0)
	}
	if ( loading > 0 ) return <div>Processing...</div>;//a simple loading page
	if (done) {
		return (
			<div>
				<Link to="/view">Check out your blog post</Link>
			</div>
		);
	}
	return (
		<form onSubmit={handleSubmit}>
			<div>
				Create Blog Post
			</div>
			<input
				placeholder="title"
				value={title}
				onChange={(e) => setTitle(e.currentTarget.value)}
			/>
			<div>
				<textarea
					value={content}
					onChange={(e) => setContent(e.currentTarget.value)}
				></textarea>
			</div>
			<input
				placeholder="secret_password"
				value={password}
				onChange={(e) => setPassword(e.currentTarget.value)}
			/>
			<button>Post</button>
		</form>
	);
}
