async function lastposts() {
  const data = await fetch("/api/v1/posts");
  const res = await data.json()

  function getUser(id) {
    return fetch("/api/v1/discord/user/" + id, {
      /*headers: {
        'Authorization': 'JAPI.NjA1NzkyOTc2MjE2MjUzNzYxMDc=.9tI.7wHsCJ1r3H5bCPhJ4aD7V'
      }*/
    }).then(r => r.json()).then(dat => dat);
  }
  const posts = await res.data.map(async (post,i) => {
    const user = await getUser(post.userid)
    const datau = await fetch("/api/user/info");
    var authUser = await datau.json();
    if (!authUser) authUser = {
      id: "007"
    };
    return `<div class="w-full" aria-label="Postagem" onclick='location.href="/post/${post.postid}"'>
 <div class="flex mx-4 md:mx-auto rounded-lg my-3 max-w-md md:max-w-2xl transition-all">
  <div class="flex items-start px-4 py-6">
    <img alt="${user.data.username??"Null"}" src="${user.data.avatarURL ?? user.data.defaultAvatarURL}" class="w-16 h-16 object-cover mr-4 shadow rounded-full"/>
    <div>
      <div class="flex items-center jusitfy-between">
        <p class="text-lg font-bold -mt-1">${user.data.username ?? "null"}</p>
        <small class="ml-2">${moment(new Date(post.created_at)).fromNow()}</small>
        <p class="ml-2">${post.fixed ? '📌' : ''}</p>
      </div>
      <p class="mt-1 text-sm">${post.content}</p>
        <div id="pid-${post.postid}" class="mt-2 flex">
        <button onclick="like()" value="${post.postid}">${feather.icons['heart'].toSvg({
      fill: post.like_ids.includes(authUser.id) ? 'white' : 'none'
    })}</button><span class="ml-1">${post.like_ids.length-1}</span>
    </div>
   </div>
  </div>
</div>
`;
    console.log(post)
  })
  // console.log(await Promise.all(posts))
  $("#timeline").html(await Promise.all(posts));
}
lastposts()
// setInterval(lastposts, 1000)