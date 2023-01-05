async function posts() {
  const data = await fetch("/api/v1/posts");
  const res = await data.json()

  function getUser(id) {
    return fetch("https://japi.rest/discord/v1/user/" + id).then(r => r.json()).then(dat => dat);
  }

  const posts = await res.data.map(async post => {
    const user = await getUser(post.userid)
    console.log(user)
    return `<div class="flex bg-gray-800 mx-4 md:mx-auto rounded-lg my-3 max-w-md md:max-w-2xl transition-all">
  <div class="flex items-start px-4 py-6">
    <img src="${user.data.avatarURL ?? user.data.defaultAvatarURL}" class="w-16 h-16 object-cover mr-4 shadow rounded-full"/>
    <div>
      <div class="flex items-center jusitfy-between">
        <p class="text-lg font-bold -mt-1">${user.data.username ?? "null"}</p>
        <small class="ml-2">${moment(new Date(post.created_at)).fromNow()}</small>
      </div>
      <p class="mt-3 text-sm">${post.content}</p>
    </div>
  </div>
</div>`;

  })
  // console.log(await Promise.all(posts))
  $("#timeline").html(await Promise.all(posts));
}
posts()
// setInterval(posts, 1000)