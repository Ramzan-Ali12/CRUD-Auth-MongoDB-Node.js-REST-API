// add user functionality
$('#add_user').submit(event => {
  alert('Data Inserted Successfuly')
})

// update data functionality

$('#update_user').submit(function (event) {
  event.preventDefault()

  var unindexed_array = $(this).serializeArray()
  console.log(unindexed_array)
  var data = {}

  $.map(unindexed_array, function (n, i) {
    data[n['name']] = n['value']
  })

  var request = {
    url: `http://localhost:3000/api/users/${data.id}`,
    method: 'PUT',
    data: data
  }

  $.ajax(request).done(function (response) {
    alert('Data Updated Successfully!')
    // Redirect to the home page
    window.location.href = '/'
  })
})
if (window.location.pathname == '/') {
  $ondelete = $('.table tbody td a.delete')
  $ondelete.click(function () {
    var id = $(this).attr('data-id')

    var request = {
      url: `http://localhost:3000/api/users/${id}`,
      method: 'DELETE'
    }

    if (confirm('Do you really want to delete this record?')) {
      $.ajax(request).done(function (response) {
        alert('Data Deleted Successfully!')
        location.reload()
      })
    }
  })
}
