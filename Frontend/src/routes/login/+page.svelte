<script>
  // Your login logic here
</script>

<div class="content flex">
  <div class="m-auto h-[50%] w-[45%] bg-dark-900 rounded-xl flex">
    <div class="h-full flex-1 flex flex-col justify-center px-6">
      <label for="username" class="text-white mb-2">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        class="px-4 py-2 rounded-lg bg-gray-800 text-white mb-4"
      />
      <label for="password" class="text-white mb-2">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        class="px-4 py-2 rounded-lg bg-gray-800 text-white mb-4"
      />
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >Login</button
      >
    </div>
    <div class="h-[90%] w-0.5 bg-dark-800 flex items-center my-3"></div>
    <div class="h-full flex-1 flex justify-center items-center">
      <img src="src/lib/images/ada-logo.png" alt="Logo" class="w-32 h-auto" />
    </div>
  </div>
</div>

<style>
  .content {
    overflow: hidden;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: url("src/lib/images/login_background.svg");
  }
</style>
